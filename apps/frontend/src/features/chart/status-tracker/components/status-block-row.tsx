"use client";

import { cn } from "cn";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DailyStatus } from "@/features/chart/status-tracker/types/status-tracker";
import {
  COMPACT_DAYS,
  dayStatusMeta,
} from "@/features/chart/status-tracker/utils/status-meta";

/** One row of day blocks; statuses hidden in the legend render muted. */
export function StatusBlockRow({
  days,
  isHidden,
  className,
}: {
  days: readonly DailyStatus[];
  isHidden: (key: string) => boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex h-8 gap-0.5", className)}>
      {days.map((day, index) => {
        const meta = dayStatusMeta[day.status];
        return (
          <Tooltip key={day.date}>
            <TooltipTrigger
              render={
                <div
                  tabIndex={0}
                  aria-label={`${day.date}: ${meta.label}`}
                  className={cn(
                    "min-w-0 flex-1 rounded-[2px] transition-opacity outline-none hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring",
                    isHidden(day.status) ? "bg-muted" : meta.className,
                    index < days.length - COMPACT_DAYS &&
                      "hidden @xl/main:block",
                  )}
                />
              }
            />
            <TooltipContent className="flex-col items-start gap-0.5">
              <span className="font-medium">{day.date}</span>
              <span>
                {meta.label}
                {day.downtime > 0 && ` · ${day.downtime} min downtime`}
              </span>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
