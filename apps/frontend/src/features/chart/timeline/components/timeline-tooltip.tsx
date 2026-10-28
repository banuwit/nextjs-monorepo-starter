"use client";

import type { ReactNode } from "react";
import { type TooltipContentProps } from "recharts";

import {
  formatDayRange,
  formatDays,
} from "@/features/chart/timeline/utils/timeline";

type RangeRow = { range: [number, number] };

/** Tooltip for ranged bars: name, group/status, range and duration. */
export function TimelineTooltip<T extends RangeRow>({
  active,
  payload,
  getTitle,
  getGroup,
  formatRange = formatDayRange,
  formatDuration = formatDays,
}: Partial<TooltipContentProps<number, string>> & {
  getTitle: (row: T) => ReactNode;
  /** Label and color of the row's group, e.g. team or status. */
  getGroup?: (row: T) => { label: ReactNode; color: string };
  formatRange?: (range: [number, number]) => string;
  formatDuration?: (range: [number, number]) => string;
}) {
  const row = payload?.[0]?.payload as T | undefined;
  if (!active || !row) return null;
  const group = getGroup?.(row);

  return (
    <div className="grid min-w-36 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="font-medium">{getTitle(row)}</div>
      {group && (
        <div className="flex items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: group.color }}
          />
          <span className="text-muted-foreground">{group.label}</span>
        </div>
      )}
      <div className="flex justify-between gap-3">
        <span className="font-mono tabular-nums">{formatRange(row.range)}</span>
        <span className="text-muted-foreground tabular-nums">
          {formatDuration(row.range)}
        </span>
      </div>
    </div>
  );
}
