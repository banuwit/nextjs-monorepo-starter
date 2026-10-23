"use client";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronDown, CircleDashed, GripVertical, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import { columns } from "@/mocks/task.mock";
import {
  TaskDueDate,
  TaskInsights,
  TaskOwner,
  TaskPriorityBadge,
  TaskTeamBadge,
} from "./task-meta";
import type { BoardState, Column, ColumnId, Task } from "../types/task";
import { findColumnId } from "../utils/task-board";

interface KanbanListProps {
  board: BoardState;
  columnOrder: ColumnId[];
  onBoardChange: (board: BoardState) => void;
  onAdd: (columnId: ColumnId) => void;
}

export function KanbanList({
  board,
  columnOrder,
  onBoardChange,
  onAdd,
}: KanbanListProps) {
  const orderedColumns = columnOrder.flatMap(
    (columnId) => columns.find((column) => column.id === columnId) ?? [],
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    onBoardChange({
      ...board,
      ...moveTask(board, activeId, overId),
    });
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto bg-muted/25 px-4 py-4 [scrollbar-color:var(--border)_transparent] lg:px-5 lg:py-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1">
        <div className="flex flex-col gap-3">
          {orderedColumns.map((column) => (
            <KanbanListGroup
              key={column.id}
              column={column}
              tasks={board[column.id]}
              onAdd={onAdd}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}

function KanbanListGroup({
  column,
  tasks,
  onAdd,
}: {
  column: Column;
  tasks: Task[];
  onAdd: (columnId: ColumnId) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "column" },
  });

  return (
    <Collapsible
      defaultOpen
      className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground"
    >
      <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4">
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              className="group h-auto min-w-0 flex-1 justify-start gap-2 px-1 py-1 hover:bg-transparent aria-expanded:bg-transparent"
            />
          }
        >
          <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-panel-open:rotate-180" />
          <div className="flex min-w-0 items-baseline gap-2 text-left">
            <h2 className="truncate font-medium text-sm leading-none">
              {column.title}
            </h2>
            <span className="text-muted-foreground text-sm tabular-nums leading-none">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>
        </CollapsibleTrigger>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Add task to ${column.title}`}
          onClick={() => onAdd(column.id)}
        >
          <Plus />
        </Button>
      </div>

      <CollapsibleContent>
        {tasks.length > 0 ? (
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul
              ref={setNodeRef}
              className={cn(
                "border-t transition-colors",
                isOver && "bg-muted/40",
              )}
            >
              {tasks.map((task) => (
                <KanbanListItem
                  key={task.id}
                  task={task}
                  columnId={column.id}
                />
              ))}
            </ul>
          </SortableContext>
        ) : (
          <div
            ref={setNodeRef}
            className={cn(
              "flex min-h-16 items-center justify-center border-t bg-muted/40 px-4 py-5 transition-colors",
              isOver && "bg-muted",
            )}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <CircleDashed className="size-4" />
              <p className="text-sm">No tasks in this column</p>
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

function KanbanListItem({
  task,
  columnId,
}: {
  task: Task;
  columnId: ColumnId;
}) {
  const isDone = columnId === "shipped";
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task" },
  });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        transition,
      }}
      className={cn(
        "border-b px-4 py-3 last:border-b-0",
        isDragging && "opacity-40",
      )}
    >
      <article className="flex flex-col gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              ref={setActivatorNodeRef}
              aria-label={`Reorder ${task.title}`}
              className="-ml-2 cursor-grab text-muted-foreground active:cursor-grabbing"
              size="icon-xs"
              variant="ghost"
              {...attributes}
              {...listeners}
            >
              <GripVertical />
            </Button>
            <h3 className="min-w-0 truncate font-medium text-sm leading-none">
              {task.title}
            </h3>
            <TaskPriorityBadge priority={task.priority} />
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
          <div className="hidden w-32 items-center gap-2 sm:flex">
            <Progress value={task.progress} className="min-w-0 flex-1 gap-0" />
            <span className="w-8 text-right text-muted-foreground text-xs tabular-nums">
              {task.progress}%
            </span>
          </div>
          <TaskTeamBadge team={task.team} />
          <TaskOwner owner={task.owner} />
          <TaskDueDate dueDate={task.dueDate} />
          <TaskInsights insights={task.insights} isDone={isDone} />
        </div>
      </article>
    </li>
  );
}

function moveTask(
  board: BoardState,
  activeId: string,
  overId: string,
): Partial<BoardState> {
  const activeColumnId = findColumnId(board, activeId);
  const overColumnId = findColumnId(board, overId);
  if (!activeColumnId || !overColumnId) return {};

  const activeItems = board[activeColumnId];
  const activeIndex = activeItems.findIndex((task) => task.id === activeId);
  if (activeIndex === -1) return {};

  const activeTask = activeItems[activeIndex];
  if (!activeTask) return {};
  if (activeColumnId === overColumnId) {
    const overIndex =
      overId === overColumnId
        ? activeItems.length - 1
        : activeItems.findIndex((task) => task.id === overId);
    if (overIndex === -1 || activeIndex === overIndex) return {};

    const nextItems = [...activeItems];
    nextItems.splice(activeIndex, 1);
    nextItems.splice(overIndex, 0, activeTask);
    return { [activeColumnId]: nextItems };
  }

  const targetItems = board[overColumnId];
  const overIndex =
    overId === overColumnId
      ? targetItems.length
      : targetItems.findIndex((task) => task.id === overId);
  if (overIndex === -1) return {};

  return {
    [activeColumnId]: activeItems.filter((task) => task.id !== activeId),
    [overColumnId]: [
      ...targetItems.slice(0, overIndex),
      activeTask,
      ...targetItems.slice(overIndex),
    ],
  };
}
