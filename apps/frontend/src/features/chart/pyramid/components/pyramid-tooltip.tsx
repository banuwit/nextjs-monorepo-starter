"use client";

import { type TooltipContentProps } from "recharts";

import { type ChartConfig } from "@/components/ui/chart";
import { formatAbs } from "@/features/chart/pyramid/utils/pyramid";

/** Tooltip for mirrored bars: shows every value as a positive number. */
export function PyramidTooltip({
  active,
  payload,
  label,
  config,
  format,
}: Partial<TooltipContentProps<number, string>> & {
  config: ChartConfig;
  format?: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="grid min-w-36 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="font-medium">{label}</div>
      {payload.map((item) => {
        const key = String(item.dataKey);
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: config[key]?.color }}
            />
            <span className="flex-1 text-muted-foreground">
              {config[key]?.label ?? key}
            </span>
            <span className="font-mono font-medium tabular-nums">
              {formatAbs(Number(item.value), format)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
