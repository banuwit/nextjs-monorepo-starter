"use client";

import * as React from "react";

import {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { GanttChartSquare } from "lucide-react";

import { Gantt, type GanttColumn } from "@/components/gantt/gantt";
import { GanttNav } from "@/components/gantt/gantt-nav";
import type {
  GanttEvent,
  GanttProposedUpdate,
  GanttResource,
  GanttResourceReorder,
} from "@/components/gantt/gantt-types";
import { GanttView } from "@/components/gantt/gantt-view";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { columns } from "@/mocks/task.mock";
import { TaskOwner, TaskPriorityBadge } from "./task-meta";
import type { BoardState, ColumnId, Task } from "../types/task";

interface KanbanGanttProps {
  board: BoardState;
  columnOrder: ColumnId[];
  onBoardChange: (board: BoardState) => void;
}

/** Bar length and hue per board column, so each phase reads as its own band. */
const columnBars: Record<ColumnId, { days: number; color: string }> = {
  ideas: { days: 5, color: "var(--color-zinc-400)" },
  planned: { days: 6, color: "var(--color-sky-500)" },
  building: { days: 8, color: "var(--color-violet-500)" },
  qa: { days: 6, color: "var(--color-amber-500)" },
  shipped: { days: 5, color: "var(--color-emerald-500)" },
};

function parseDueDate(dueDate: string) {
  return startOfDay(parseISO(dueDate));
}

/**
 * Lays the board out on a timeline that straddles today: due dates keep their
 * relative spacing, but the earliest one is anchored ten days before the
 * current week so every bar reads against the now-line.
 */
function buildTimeline(
  board: BoardState,
  columnOrder: ColumnId[],
  today: Date,
) {
  const dueDates = columnOrder.flatMap((columnId) =>
    board[columnId].map((task) => parseDueDate(task.dueDate)),
  );
  if (dueDates.length === 0) return null;

  const earliestDue = dueDates.reduce((earliest, date) =>
    date < earliest ? date : earliest,
  );
  const timelineStart = addDays(
    startOfWeek(startOfDay(today), { weekStartsOn: 0 }),
    -10,
  );

  const resources: GanttResource[] = [];
  const events: GanttEvent<Task>[] = [];

  for (const columnId of columnOrder) {
    const tasks = board[columnId];
    if (tasks.length === 0) continue;

    const column = columns.find((item) => item.id === columnId);
    const bar = columnBars[columnId];

    resources.push({
      id: columnId,
      title: column?.title ?? columnId,
      children: tasks.map((task) => ({ id: task.id, title: task.title })),
    });

    for (const task of tasks) {
      const startDate = task.startDate
        ? parseDueDate(task.startDate)
        : addDays(parseDueDate(task.dueDate), 1 - bar.days);
      // `end` is exclusive, so add a day to keep the due date inside the bar.
      const end = addDays(
        timelineStart,
        differenceInCalendarDays(parseDueDate(task.dueDate), earliestDue) + 1,
      );

      events.push({
        id: `bar-${task.id}`,
        title: task.title,
        start: addDays(
          timelineStart,
          differenceInCalendarDays(startDate, earliestDue),
        ),
        end,
        allDay: true,
        color: bar.color,
        progress: task.progress,
        resourceId: task.id,
        data: task,
      });
    }
  }

  return { earliestDue, events, resources, timelineStart };
}

export function KanbanGantt({
  board,
  columnOrder,
  onBoardChange,
}: KanbanGanttProps) {
  const timeline = React.useMemo(
    () => buildTimeline(board, columnOrder, new Date()),
    [board, columnOrder],
  );

  const taskById = React.useMemo(() => {
    const entries = columnOrder.flatMap((columnId) =>
      board[columnId].map((task) => [task.id, task] as const),
    );
    return new Map(entries);
  }, [board, columnOrder]);

  // Extra tree-panel columns after the pinned task name column. Group rows
  // (the board columns) render nothing so only tasks carry the table data.
  const treeColumns = React.useMemo<GanttColumn[]>(
    () => [
      {
        id: "owner",
        title: "Owner",
        width: 140,
        align: "start",
        render: ({ resource, isGroup }) => {
          if (isGroup) return null;
          const task = taskById.get(resource.id);
          return task ? <TaskOwner owner={task.owner} /> : null;
        },
      },
      {
        id: "priority",
        title: "Priority",
        width: 100,
        align: "start",
        render: ({ resource, isGroup }) => {
          if (isGroup) return null;
          const task = taskById.get(resource.id);
          return task ? <TaskPriorityBadge priority={task.priority} /> : null;
        },
      },
      {
        id: "progress",
        title: "Progress",
        width: 76,
        align: "end",
        render: ({ resource, isGroup }) => {
          if (isGroup) return null;
          const task = taskById.get(resource.id);
          return task ? (
            <span className="text-muted-foreground tabular-nums">
              {task.progress}%
            </span>
          ) : null;
        },
      },
    ],
    [taskById],
  );

  function handleEventUpdate({ end, event, start }: GanttProposedUpdate<Task>) {
    if (!timeline) return false;

    const taskId = event.data?.id;
    const columnId = taskId
      ? columnOrder.find((id) => board[id].some((task) => task.id === taskId))
      : undefined;
    if (!taskId || !columnId) return false;

    const dueDate = format(
      addDays(
        timeline.earliestDue,
        differenceInCalendarDays(end, timeline.timelineStart) - 1,
      ),
      "yyyy-MM-dd",
    );
    const startDate = format(
      addDays(
        timeline.earliestDue,
        differenceInCalendarDays(start, timeline.timelineStart),
      ),
      "yyyy-MM-dd",
    );

    onBoardChange({
      ...board,
      [columnId]: board[columnId].map((task) =>
        task.id === taskId ? { ...task, dueDate, startDate } : task,
      ),
    });

    return true;
  }

  function canReorderTask({ parentId, resourceId }: GanttResourceReorder) {
    const sourceColumnId = columnOrder.find((columnId) =>
      board[columnId].some((task) => task.id === resourceId),
    );
    return sourceColumnId !== undefined && parentId === sourceColumnId;
  }

  function handleResourceReorder(proposal: GanttResourceReorder) {
    if (!canReorderTask(proposal) || !proposal.parentId) return false;

    const columnId = columnOrder.find((id) => id === proposal.parentId);
    if (!columnId) return false;

    const reorderedTaskIds = proposal.resources
      .find((resource) => resource.id === columnId)
      ?.children?.map((resource) => resource.id);
    const tasksById = new Map(board[columnId].map((task) => [task.id, task]));
    if (!reorderedTaskIds || reorderedTaskIds.length !== tasksById.size)
      return false;

    const reorderedTasks = reorderedTaskIds
      .map((taskId) => tasksById.get(taskId))
      .filter((task): task is Task => !!task);
    if (reorderedTasks.length !== tasksById.size) return false;

    onBoardChange({
      ...board,
      [columnId]: reorderedTasks,
    });
  }

  if (!timeline) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted/25 p-4 lg:p-5">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <GanttChartSquare />
            </EmptyMedia>
            <EmptyTitle>Nothing to schedule</EmptyTitle>
            <EmptyDescription>
              Add a task to the board to see it plotted on the timeline.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-hidden bg-muted/25 p-4 lg:p-5">
      <Card className="h-full w-full overflow-hidden py-0">
        <CardContent className="h-full min-h-0 p-0">
          <Gantt
            key={columnOrder.join("-")}
            events={timeline.events}
            resources={timeline.resources}
            defaultScale="month"
            defaultInteractions={{
              drag: true,
              resize: true,
              selectSlot: false,
            }}
            onEventUpdate={handleEventUpdate}
            canReorderResource={canReorderTask}
            onResourceReorder={handleResourceReorder}
            rowCheckboxes={false}
            columns={treeColumns}
            treePanel={{ width: 520, nameColumnWidth: 200 }}
            className="h-full w-full text-sm"
          >
            <GanttNav className="min-w-0" />
            <GanttView />
          </Gantt>
        </CardContent>
      </Card>
    </div>
  );
}
