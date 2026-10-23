"use client";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  TaskDueDate,
  TaskInsights,
  TaskOwner,
  TaskPriorityBadge,
  TaskTeamBadge,
} from "./task-meta";
import type { ColumnId, Task } from "../types/task";

export function TaskCard({
  task,
  columnId,
  isOverlay = false,
}: {
  task: Task;
  columnId?: ColumnId;
  isOverlay?: boolean;
}) {
  const isDone = columnId === "shipped";
  const showBuildingDetails =
    columnId === "building" && typeof task.progress === "number";
  const owner = task.owner;

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-xs",
        isOverlay && "w-68 rotate-1 shadow-lg",
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 truncate font-medium text-sm leading-none">
            {task.title}
          </h3>
          <TaskPriorityBadge priority={task.priority} />
        </div>
      </div>

      {!showBuildingDetails ? (
        <div className="flex items-center justify-between">
          <TaskOwner owner={owner} />
          <TaskDueDate dueDate={task.dueDate} />
        </div>
      ) : null}

      {showBuildingDetails ? (
        <div className="flex flex-col gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span className="leading-none">Progress</span>
              <span className="tabular-nums leading-none">
                {task.progress}%
              </span>
            </div>
            <Progress value={task.progress} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-sm">Owner</span>
              <TaskOwner owner={owner} namePosition="start" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-sm">Due date</span>
              <TaskDueDate dueDate={task.dueDate} />
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground text-sm">Team</span>
              <TaskTeamBadge team={task.team} />
            </div>
          </div>
        </div>
      ) : null}

      <Separator />

      <TaskInsights insights={task.insights} isDone={isDone} />
    </article>
  );
}
