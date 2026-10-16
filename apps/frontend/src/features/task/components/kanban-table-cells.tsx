"use client";

import { useSortable } from "@dnd-kit/sortable";
import {
  CalendarDays,
  Copy,
  GripVertical,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useCallback, useLayoutEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  columns,
  taskOwnerOptions,
  taskPriorities,
  taskTeams,
} from "@/mocks/task.mock";
import {
  TaskInsights,
  TaskOwner,
  TaskPriorityBadge,
  TaskStatusBadge,
  TaskTeamBadge,
} from "./task-meta";
import type { ColumnId, TaskPriority, TaskTeam } from "./types";
import type { BoardTask } from "./utils";

const cellControlClassName =
  "h-7 min-w-0 border-transparent bg-transparent px-1.5 shadow-none dark:bg-transparent dark:hover:bg-muted/40";

type TaskPatch = Partial<
  Pick<
    BoardTask,
    | "title"
    | "columnId"
    | "priority"
    | "owner"
    | "team"
    | "dueDate"
    | "progress"
  >
>;

interface EditableTaskCellProps {
  invalid?: boolean;
  onChange: (patch: TaskPatch) => void;
  task: BoardTask;
}

export function TaskTitleCell({
  invalid,
  onChange,
  task,
}: EditableTaskCellProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
  });
  const titleCellRef = useRef<HTMLDivElement | null>(null);

  const setSortableNodeRef = useCallback(
    (node: HTMLDivElement | null) => {
      titleCellRef.current = node;
      setNodeRef(node?.closest("tr") ?? null);
    },
    [setNodeRef],
  );

  useLayoutEffect(() => {
    const row = titleCellRef.current?.closest("tr");
    if (!row) return;

    const previous = {
      opacity: row.style.opacity,
      transform: row.style.transform,
      transition: row.style.transition,
    };

    row.style.opacity = isDragging ? "0.4" : "";
    row.style.transform = transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "";
    row.style.transition = transition ?? "";

    return () => {
      row.style.opacity = previous.opacity;
      row.style.transform = previous.transform;
      row.style.transition = previous.transition;
    };
  }, [isDragging, transform, transition]);

  return (
    <div
      ref={setSortableNodeRef}
      className="flex min-w-0 items-center gap-1 py-0.5"
    >
      <Button
        ref={setActivatorNodeRef}
        aria-label={`Reorder ${task.title || "task"}`}
        className="cursor-grab text-muted-foreground active:cursor-grabbing"
        size="icon-xs"
        variant="ghost"
        {...attributes}
        {...listeners}
      >
        <GripVertical />
      </Button>
      <Input
        aria-invalid={invalid}
        aria-label="Task title"
        className={cn(cellControlClassName, "h-7 flex-1 font-medium")}
        data-cell-interactive
        onChange={(event) => onChange({ title: event.target.value })}
        placeholder="Task title"
        value={task.title}
      />
    </div>
  );
}

export function TaskStatusCell({ onChange, task }: EditableTaskCellProps) {
  return (
    <Select
      onValueChange={(value) => {
        if (!value) return;
        onChange({ columnId: value as ColumnId });
      }}
      value={task.columnId}
    >
      <SelectTrigger
        aria-label="Task status"
        className={cn(cellControlClassName, "w-full min-w-28 justify-between")}
        data-cell-interactive
        size="sm"
      >
        <SelectValue>
          <TaskStatusBadge columnId={task.columnId} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
        <SelectGroup>
          {columns.map((column) => (
            <SelectItem key={column.id} value={column.id}>
              <TaskStatusBadge columnId={column.id} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function TaskPriorityCell({ onChange, task }: EditableTaskCellProps) {
  return (
    <Select
      onValueChange={(value) => {
        if (!value) return;
        onChange({ priority: value as TaskPriority });
      }}
      value={task.priority}
    >
      <SelectTrigger
        aria-label="Task priority"
        className={cn(cellControlClassName, "w-full min-w-24 justify-between")}
        data-cell-interactive
        size="sm"
      >
        <SelectValue>
          <TaskPriorityBadge priority={task.priority} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
        <SelectGroup>
          {taskPriorities.map((priority) => (
            <SelectItem key={priority} value={priority}>
              <TaskPriorityBadge priority={priority} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function TaskOwnerCell({ onChange, task }: EditableTaskCellProps) {
  return (
    <Select
      onValueChange={(value) => {
        const owner = taskOwnerOptions.find((option) => option.name === value);
        if (!owner) return;
        onChange({ owner });
      }}
      value={task.owner.name}
    >
      <SelectTrigger
        aria-label="Task owner"
        className={cn(cellControlClassName, "w-full min-w-36 justify-between")}
        data-cell-interactive
        size="sm"
      >
        <SelectValue>
          <TaskOwner owner={task.owner} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
        <SelectGroup>
          {taskOwnerOptions.map((owner) => (
            <SelectItem key={owner.name} value={owner.name}>
              <TaskOwner owner={owner} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function TaskTeamCell({ onChange, task }: EditableTaskCellProps) {
  return (
    <Select
      onValueChange={(value) => {
        if (!value) return;
        onChange({ team: value as TaskTeam });
      }}
      value={task.team}
    >
      <SelectTrigger
        aria-label="Task team"
        className={cn(cellControlClassName, "w-full min-w-28 justify-between")}
        data-cell-interactive
        size="sm"
      >
        <SelectValue>
          <TaskTeamBadge team={task.team} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start" alignItemWithTrigger={false}>
        <SelectGroup>
          {taskTeams.map((team) => (
            <SelectItem key={team} value={team}>
              <TaskTeamBadge team={team} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function TaskDueDateCell({
  invalid,
  onChange,
  task,
}: EditableTaskCellProps) {
  return (
    <InputGroup
      className={cn(
        "h-7 min-w-32 border-transparent bg-transparent shadow-none dark:bg-transparent",
        invalid && "border-destructive",
      )}
      data-cell-interactive
    >
      <InputGroupInput
        aria-invalid={invalid}
        aria-label="Due date"
        onChange={(event) => onChange({ dueDate: event.target.value })}
        type="date"
        value={task.dueDate}
      />
      <InputGroupAddon align="inline-end">
        <CalendarDays />
      </InputGroupAddon>
    </InputGroup>
  );
}

export function TaskProgressCell({
  invalid,
  onChange,
  task,
}: EditableTaskCellProps) {
  const progress = Number.isFinite(task.progress)
    ? Math.min(100, Math.max(0, task.progress))
    : 0;

  return (
    <div className="flex min-w-32 items-center gap-2">
      <Progress className="min-w-0 flex-1 gap-0" value={progress} />
      <Input
        aria-invalid={invalid}
        aria-label="Task progress"
        className={cn(
          cellControlClassName,
          "h-7 w-14 px-1 text-right tabular-nums",
        )}
        data-cell-interactive
        inputMode="numeric"
        max={100}
        min={0}
        onChange={(event) => {
          const nextValue =
            event.target.value === "" ? Number.NaN : Number(event.target.value);
          onChange({ progress: nextValue });
        }}
        type="number"
        value={Number.isFinite(task.progress) ? task.progress : ""}
      />
    </div>
  );
}

export function TaskActivityCell({ task }: { task: BoardTask }) {
  return (
    <TaskInsights
      insights={task.insights}
      isDone={task.columnId === "shipped"}
    />
  );
}

export function TaskActionsCell({
  onDelete,
  onDuplicate,
}: {
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label="Open task actions"
            className="size-7"
            data-cell-interactive
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} variant="destructive">
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
