"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Modifier,
  type DraggableAttributes,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { createContext, useContext, useId, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const verticalOnly: Modifier = ({ transform }) => ({ ...transform, x: 0 });
const modifiers = [verticalOnly];

type DragHandleContext = {
  attributes: DraggableAttributes;
  listeners: ReturnType<typeof useSortable>["listeners"];
  setHandleNode: (node: HTMLElement | null) => void;
};
const DragHandleContext = createContext<DragHandleContext | null>(null);

export function DataGridRowDnd({
  items,
  onReorder,
  children,
}: {
  items: string[];
  onReorder: (activeId: string, overId: string) => void;
  children: ReactNode;
}) {
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={modifiers}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "Press Space to pick up a row, use Arrow Up or Arrow Down to move it, Space to drop, or Escape to cancel.",
        },
        announcements: {
          onDragStart: ({ active }) =>
            `Picked up row ${active.id}, position ${items.indexOf(String(active.id)) + 1} of ${items.length}.`,
          onDragOver: ({ active, over }) =>
            over
              ? `Row ${active.id}, target position ${items.indexOf(String(over.id)) + 1} of ${items.length}.`
              : "Outside the list. Drop to cancel.",
          onDragEnd: ({ active, over }) =>
            over
              ? `Row ${active.id} dropped at position ${items.indexOf(String(over.id)) + 1}.`
              : "Reordering cancelled.",
          onDragCancel: () =>
            "Reordering cancelled. The order has not changed.",
        },
      }}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const activeId = String(active.id);
        const overId = String(over.id);
        if (items.includes(activeId) && items.includes(overId)) {
          onReorder(activeId, overId);
        }
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export function DataGridSortableRow({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id });

  return (
    <DragHandleContext.Provider
      value={{ attributes, listeners, setHandleNode: setActivatorNodeRef }}
    >
      <TableRow
        ref={setNodeRef}
        data-row-id={id}
        data-dragging={isDragging || undefined}
        style={{
          transform: transform
            ? `translate3d(0, ${transform.y}px, 0)`
            : undefined,
          transition,
        }}
        className={cn(
          "group/row relative motion-reduce:transition-none",
          isDragging && "z-10 bg-muted shadow-lg outline outline-primary",
          isOver && !isDragging && "bg-accent",
        )}
      >
        {children}
      </TableRow>
    </DragHandleContext.Provider>
  );
}

export function DataGridRowDragHandle({ label }: { label: string }) {
  const context = useContext(DragHandleContext);
  if (!context)
    throw new Error("DataGridRowDragHandle requires a sortable row.");
  const { attributes, listeners, setHandleNode } = context;

  return (
    <Button
      ref={setHandleNode}
      variant="ghost"
      size="icon-sm"
      className="touch-none cursor-grab text-muted-foreground active:cursor-grabbing"
      {...attributes}
      {...listeners}
      aria-label={label}
      title={label}
    >
      <GripVertical />
    </Button>
  );
}
