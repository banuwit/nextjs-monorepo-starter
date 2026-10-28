"use client";

import { type TooltipContentProps } from "recharts";

import type {
  BoxPlotSeries,
  BoxStats,
} from "@/features/chart/box-plot/types/box-plot";
import { boxIqr } from "@/features/chart/box-plot/utils/box-plot";

const summaryKeys = [
  { key: "max", label: "Max" },
  { key: "q3", label: "Q3" },
  { key: "median", label: "Median" },
  { key: "q1", label: "Q1" },
  { key: "min", label: "Min" },
] as const;

/**
 * Five-number summary per visible series, plus IQR and optional mean and
 * outlier count. Reads `row[series.key]` from the hovered category.
 */
export function BoxPlotTooltip({
  active,
  payload,
  series,
  format,
  showMean = false,
}: Partial<TooltipContentProps<number, string>> & {
  series: BoxPlotSeries[];
  format: (value: number) => string;
  showMean?: boolean;
}) {
  // Scatter points can be in the payload too; use the row that has the boxes.
  const row = payload
    ?.map((item) => item.payload as Record<string, unknown> | undefined)
    .find((item) => item && series.some((entry) => entry.key in item));
  if (!active || !row || series.length === 0) return null;

  return (
    <div className="grid min-w-36 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="font-medium">{String(row.label)}</div>
      {series.map((entry) => {
        const stats = row[entry.key] as BoxStats;
        const outliers = stats.outliers?.length ?? 0;
        return (
          <div key={entry.key} className="grid gap-1">
            {series.length > 1 && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="size-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: entry.color }}
                  aria-hidden="true"
                />
                {entry.label}
              </div>
            )}
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
              {summaryKeys.map(({ key, label }) => (
                <div key={key} className="contents">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-mono font-medium tabular-nums">
                    {format(stats[key])}
                  </dd>
                </div>
              ))}
              {showMean && stats.mean !== undefined && (
                <>
                  <dt className="text-muted-foreground">Mean</dt>
                  <dd className="text-right font-mono tabular-nums">
                    {format(stats.mean)}
                  </dd>
                </>
              )}
              <dt className="text-muted-foreground">IQR</dt>
              <dd className="text-right font-mono tabular-nums">
                {format(boxIqr(stats))}
              </dd>
              {outliers > 0 && (
                <>
                  <dt className="text-destructive">Outliers</dt>
                  <dd className="text-right font-mono text-destructive tabular-nums">
                    {outliers}
                  </dd>
                </>
              )}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
