"use client";

import { useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LockIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Lead, Pipeline, PipelineStage } from "../types/leads";
import { canMoveLead } from "../utils/lead-movement";
import { formatCompactCurrency } from "../utils/leads";
import { LeadCard } from "./lead-card";
import { StageDot } from "./stage-badge";

type KanbanProps = {
  pipeline: Pipeline;
  leads: Lead[];
  today: string;
  onOpen: (lead: Lead) => void;
  onMove: (lead: Lead, stageId: string) => void;
  onReorder: (leadId: string, beforeId: string | null) => void;
  onAdd: (stageId: string) => void;
};

/** Lead ids per stage; while dragging, the live preview of where the card would land. */
type StageItems = Record<string, string[]>;

export function LeadsKanban({
  pipeline,
  leads,
  today,
  onOpen,
  onMove,
  onReorder,
  onAdd,
}: KanbanProps) {
  const [active, setActive] = useState<Lead | null>(null);
  const [preview, setPreview] = useState<StageItems | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const leadsById = useMemo(
    () => new Map(leads.map((lead) => [lead.id, lead])),
    [leads],
  );
  const base = useMemo<StageItems>(
    () =>
      Object.fromEntries(
        pipeline.stages.map((stage) => [
          stage.id,
          leads
            .filter((lead) => lead.stageId === stage.id)
            .map((lead) => lead.id),
        ]),
      ),
    [pipeline, leads],
  );
  const items = preview ?? base;

  const stageOf = (id: string, source: StageItems) =>
    source[id]
      ? id
      : Object.keys(source).find((stageId) => source[stageId]?.includes(id));

  function handleDragStart(event: DragStartEvent) {
    setActive(leadsById.get(String(event.active.id)) ?? null);
    setPreview(base);
  }

  // Like Task: the card moves into the hovered column right away, so neighbours slide
  // apart and the dimmed original marks the landing slot. Locked stages never receive it.
  function handleDragOver({ active: dragged, over }: DragOverEvent) {
    if (!over || !active) return;
    const activeId = String(dragged.id);
    const overId = String(over.id);
    setPreview((current) => {
      if (!current) return current;
      const from = stageOf(activeId, current);
      const to = stageOf(overId, current);
      if (!from || !to) return current;
      // Hovering a locked stage sends the card back home, even if it passed a valid one before.
      if (to !== active.stageId && !canMoveLead(pipeline, active, to).ok)
        return base;
      if (from === to) return current;
      const target = current[to] ?? [];
      const overIndex = target.indexOf(overId);
      const at = overIndex >= 0 ? overIndex : target.length;
      return {
        ...current,
        [from]: (current[from] ?? []).filter((id) => id !== activeId),
        [to]: [...target.slice(0, at), activeId, ...target.slice(at)],
      };
    });
  }

  function handleDragEnd({ active: dragged, over }: DragEndEvent) {
    const lead = active;
    const final = preview;
    setActive(null);
    setPreview(null);
    if (!lead || !final || !over) return;

    const activeId = String(dragged.id);
    const stageId = stageOf(activeId, final);
    if (!stageId) return;
    // Released over a locked stage: the lead stays where it started.
    const dropStage = stageOf(String(over.id), final);
    if (
      dropStage &&
      dropStage !== lead.stageId &&
      !canMoveLead(pipeline, lead, dropStage).ok
    )
      return;
    const column = final[stageId] ?? [];
    const activeIndex = column.indexOf(activeId);
    const overIndex = column.indexOf(String(over.id));
    const ordered =
      overIndex >= 0 && overIndex !== activeIndex
        ? arrayMove(column, activeIndex, overIndex)
        : column;
    const beforeId = ordered[ordered.indexOf(activeId) + 1] ?? null;
    const changedStage = stageId !== lead.stageId;
    const changedOrder =
      beforeId !==
      (base[stageId]?.[base[stageId].indexOf(activeId) + 1] ?? null);
    if (!changedStage && !changedOrder) return;

    if (changedStage) onMove(lead, stageId);
    // A move to the lost stage waits for its reason dialog, so it cannot be positioned yet.
    if (
      pipeline.stages.find((stage) => stage.id === stageId)?.kind !== "lost"
    ) {
      onReorder(lead.id, beforeId);
    }
  }

  return (
    <DndContext
      id={`leads-kanban-${pipeline.id}`}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setActive(null);
        setPreview(null);
      }}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "Tekan spasi untuk mengangkat lead, panah untuk memindahkan, spasi lagi untuk melepas, atau Escape untuk batal.",
        },
      }}
    >
      <div className="-mx-4 overflow-x-auto px-4 pb-2">
        <div className="flex min-w-full gap-3">
          {pipeline.stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              leads={(items[stage.id] ?? []).flatMap(
                (id) => leadsById.get(id) ?? [],
              )}
              locked={
                active !== null &&
                active.stageId !== stage.id &&
                !canMoveLead(pipeline, active, stage.id).ok
              }
              pipeline={pipeline}
              today={today}
              onOpen={onOpen}
              onMove={onMove}
              onAdd={onAdd}
            />
          ))}
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {active ? (
          <LeadCard lead={active} pipeline={pipeline} today={today} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({
  stage,
  leads,
  locked,
  pipeline,
  today,
  onOpen,
  onMove,
  onAdd,
}: Omit<KanbanProps, "leads" | "onReorder"> & {
  stage: PipelineStage;
  leads: Lead[];
  locked: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    disabled: locked,
  });
  const total = leads.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <section
      ref={setNodeRef}
      aria-label={`${stage.name}, ${leads.length} lead`}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-xl border bg-muted/40 transition-[opacity,background-color]",
        stage.kind !== "open" && "bg-muted/20",
        isOver && "bg-primary/5 ring-2 ring-ring/40",
        locked && "opacity-40",
      )}
    >
      <header className="flex items-start justify-between gap-2 px-3 pt-3 pb-2">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-medium">
            <StageDot stage={stage} />
            <span className="truncate">{stage.name}</span>
            <span className="text-xs font-normal text-muted-foreground tabular-nums">
              {leads.length}
            </span>
            {locked && (
              <LockIcon aria-label="Tidak dapat dituju" className="size-3.5" />
            )}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground tabular-nums">
            {formatCompactCurrency(total)}
            {stage.kind === "open" && ` · ${stage.probability}%`}
          </p>
        </div>
        {stage.kind === "open" && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="-mr-1 text-muted-foreground"
            aria-label={`Tambah lead di ${stage.name}`}
            onClick={() => onAdd(stage.id)}
          >
            <PlusIcon />
          </Button>
        )}
      </header>
      <SortableContext
        items={leads.map((lead) => lead.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex max-h-[34rem] min-h-28 flex-col gap-2 overflow-y-auto px-2 pb-2">
          {leads.map((lead) => (
            <SortableLead
              key={lead.id}
              lead={lead}
              pipeline={pipeline}
              today={today}
              onOpen={onOpen}
              onMove={onMove}
            />
          ))}
          {leads.length === 0 && (
            <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
              Belum ada lead
            </p>
          )}
        </div>
      </SortableContext>
    </section>
  );
}

function SortableLead({
  lead,
  pipeline,
  today,
  onOpen,
  onMove,
}: Pick<KanbanProps, "pipeline" | "today" | "onOpen" | "onMove"> & {
  lead: Lead;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      className={cn(
        "cursor-grab touch-none active:cursor-grabbing",
        isDragging && "opacity-30",
      )}
      {...attributes}
      {...listeners}
      role="group"
      aria-label={`Seret ${lead.company}`}
    >
      <LeadCard
        lead={lead}
        pipeline={pipeline}
        today={today}
        onOpen={onOpen}
        onMove={onMove}
      />
    </div>
  );
}
