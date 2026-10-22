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
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { createContext, useId, useLayoutEffect, useRef, type ComponentProps, type CSSProperties, type ReactNode } from "react";

import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const horizontalOnly: Modifier = ({ transform }) => ({ ...transform, y: 0 });
const modifiers = [horizontalOnly];

export function DataGridColumnDnd({
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
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={modifiers}
      accessibility={{
        screenReaderInstructions: {
          draggable: "Press Space to pick up a column, Arrow Left or Arrow Right to move, Space to drop, or Escape to cancel.",
        },
        announcements: {
          onDragStart: ({ active }) => `Picked up column ${active.id}.`,
          onDragOver: ({ over }) => over
            ? `Target position ${items.indexOf(String(over.id)) + 1} of ${items.length}.`
            : "Outside the headers. Drop to cancel.",
          onDragEnd: ({ active, over }) => over
            ? `Column ${active.id} dropped at position ${items.indexOf(String(over.id)) + 1}.`
            : "Column reordering cancelled.",
          onDragCancel: () => "Column reordering cancelled. The order has not changed.",
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
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export const ColumnDragHandleContext = createContext<{
  attributes: DraggableAttributes;
  listeners: ReturnType<typeof useSortable>["listeners"];
  setHandleNode: (node: HTMLElement | null) => void;
} | null>(null);

/** Header and body cells share the same motion without duplicate DnD registrations. */
export function getColumnMotionStyle(index: number): CSSProperties {
  return {
    transform: `var(--grid-column-${index}-transform, translate3d(0, 0, 0))`,
    transition: `var(--grid-column-${index}-transition, none)`,
    position: "relative",
    zIndex: `var(--grid-column-${index}-z, auto)`,
    backgroundColor: `var(--grid-column-${index}-background)`,
  };
}

export function DataGridSortableColumnHead({
  columnId,
  columnIndex,
  headerRef,
  className,
  style,
  children,
  ...props
}: {
  columnId: string;
  columnIndex: number;
  headerRef: (node: HTMLTableCellElement | null) => void;
} & Omit<ComponentProps<"th">, "ref">) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: columnId, transition: { duration: 220, easing: "cubic-bezier(0.2, 0, 0, 1)" } });
  const tableRef = useRef<HTMLTableElement | null>(null);
  const x = transform?.x ?? 0;

  // CSS variables keep every cell in lockstep with dnd-kit's sortable animation.
  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const prefix = `--grid-column-${columnIndex}`;
    table.style.setProperty(`${prefix}-transform`, `translate3d(${x}px, 0, 0)`);
    table.style.setProperty(`${prefix}-transition`, transition ?? "none");
    table.style.setProperty(`${prefix}-z`, isDragging ? "10" : "auto");
    table.style.setProperty(`${prefix}-background`, isDragging ? "var(--muted)" : "revert-layer");
    return () => {
      for (const suffix of ["transform", "transition", "z", "background"]) {
        table.style.removeProperty(`${prefix}-${suffix}`);
      }
    };
  }, [columnIndex, x, transition, isDragging]);

  return (
    <ColumnDragHandleContext.Provider
      value={{ attributes, listeners, setHandleNode: setActivatorNodeRef }}
    >
      <TableHead
        {...props}
        ref={(node) => {
          setNodeRef(node);
          headerRef(node);
          tableRef.current = node?.closest("table") ?? null;
        }}
        data-column-id={columnId}
        data-dragging={isDragging || undefined}
        style={{ ...style, ...getColumnMotionStyle(columnIndex) }}
        className={cn("motion-reduce:transition-none!", isDragging && "shadow-md", className)}
      >
        {children}
      </TableHead>
    </ColumnDragHandleContext.Provider>
  );
}
