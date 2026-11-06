"use client";

import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  type CollisionDetection,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
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
  onAdd: (stageId: string) => void;
};

// Pointer drops land on the column under the cursor; keyboard drops fall back to overlap.
const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : rectIntersection(args);
};

export function LeadsKanban({ pipeline, leads, today, onOpen, onMove, onAdd }: KanbanProps) {
  const [active, setActive] = useState<Lead | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor),
  );

  function handleDragStart(event: DragStartEvent) {
    setActive(leads.find((lead) => lead.id === event.active.id) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const lead = active;
    setActive(null);
    if (!lead || !event.over) return;
    const stageId = String(event.over.id);
    if (stageId !== lead.stageId) onMove(lead, stageId);
  }

  return (
    <DndContext
      id={`leads-kanban-${pipeline.id}`}
      sensors={sensors}
      collisionDetection={collision}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActive(null)}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "Tekan spasi untuk mengangkat lead, panah kiri/kanan untuk memilih tahap, spasi lagi untuk melepas, atau Escape untuk batal.",
        },
      }}
    >
      <div className="-mx-4 overflow-x-auto px-4 pb-2">
        <div className="flex min-w-full gap-3">
          {pipeline.stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              leads={leads.filter((lead) => lead.stageId === stage.id)}
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
}: Omit<KanbanProps, "leads"> & {
  stage: PipelineStage;
  leads: Lead[];
  locked: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id, disabled: locked });
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
            {locked && <LockIcon aria-label="Tidak dapat dituju" className="size-3.5" />}
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
      <div className="flex max-h-[34rem] min-h-28 flex-col gap-2 overflow-y-auto px-2 pb-2">
        {leads.map((lead) => (
          <DraggableLead
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
    </section>
  );
}

function DraggableLead({
  lead,
  pipeline,
  today,
  onOpen,
  onMove,
}: Pick<KanbanProps, "pipeline" | "today" | "onOpen" | "onMove"> & { lead: Lead }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id });

  return (
    <div ref={setNodeRef} className={cn(isDragging && "opacity-30")}>
      <LeadCard
        lead={lead}
        pipeline={pipeline}
        today={today}
        onOpen={onOpen}
        onMove={onMove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
