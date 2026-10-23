"use client";

import { format, parseISO } from "date-fns";

import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  FileText,
  Flame,
  type LucideIcon,
  MessageSquare,
  Minus,
  Paperclip,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { columns, tagTones } from "@/mocks/task.mock";
import type {
  ColumnId,
  TaskInsight,
  TaskInsightLabel,
  TaskOwnerProfile,
  TaskPriority,
  TaskTeam,
} from "../types/task";

export const taskInsightIcons: Record<TaskInsightLabel, LucideIcon> = {
  Attachments: Paperclip,
  Comments: MessageSquare,
  Documents: FileText,
};

export const priorityBadgeConfig: Record<
  TaskPriority,
  { icon: LucideIcon; variant: "destructive" | "secondary"; className: string }
> = {
  High: {
    icon: Flame,
    variant: "destructive",
    className: "border-transparent",
  },
  Low: {
    icon: Minus,
    variant: "secondary",
    className:
      "bg-slate-500/10 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  },
  Medium: {
    icon: ArrowUpRight,
    variant: "secondary",
    className:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  },
};

export const columnTones: Record<ColumnId, string> = {
  ideas: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  planned: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  building:
    "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  qa: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  shipped: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = priorityBadgeConfig[priority];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "shrink-0 rounded-md border-transparent px-2 font-medium",
        config.className,
      )}
    >
      <Icon data-icon="inline-start" />
      {priority}
    </Badge>
  );
}

export function TaskTeamBadge({ team }: { team: TaskTeam }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md border-transparent px-2 font-medium",
        tagTones[team],
      )}
    >
      {team}
    </Badge>
  );
}

export function TaskStatusBadge({ columnId }: { columnId: ColumnId }) {
  const column = columns.find((item) => item.id === columnId);

  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md border-transparent px-2 font-medium",
        columnTones[columnId],
      )}
    >
      {column?.title ?? columnId}
    </Badge>
  );
}

export function TaskOwner({
  owner,
  namePosition = "end",
}: {
  owner: TaskOwnerProfile;
  namePosition?: "start" | "end";
}) {
  const name = (
    <span className="truncate text-muted-foreground text-sm">{owner.name}</span>
  );
  const avatar = (
    <Avatar className={cn("size-5 after:rounded-sm", owner.tone)}>
      <AvatarFallback className="rounded-sm text-[10px]">
        {owner.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <div className="flex min-w-0 items-center gap-1.5">
      {namePosition === "start" ? name : null}
      {avatar}
      {namePosition === "end" ? name : null}
    </div>
  );
}

export function TaskDueDate({ dueDate }: { dueDate: string }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
      <span className="truncate text-sm">
        {format(parseISO(dueDate), "MMM d")}
      </span>
      <CalendarDays className="size-3" />
    </span>
  );
}

export function TaskInsights({
  insights,
  isDone = false,
}: {
  insights: TaskInsight[];
  isDone?: boolean;
}) {
  if (isDone) {
    return (
      <div className="flex items-center gap-1 font-medium text-green-700 text-sm dark:text-green-600">
        <BadgeCheck className="size-4" />
        Done
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-muted-foreground text-sm">
      {insights.map((insight) => {
        const Icon = taskInsightIcons[insight.label];

        return (
          <span
            key={insight.label}
            className="flex items-center gap-1.5 text-sm"
          >
            <Icon className="size-3.5" />
            {insight.count}
          </span>
        );
      })}
    </div>
  );
}
