"use client";

import { type TooltipContentProps } from "recharts";

import type { WaterfallRow } from "@/features/chart/waterfall/types/waterfall";
import { formatSigned } from "@/features/chart/waterfall/utils/waterfall";
import { waterfallConfig } from "@/features/chart/waterfall/utils/waterfall-config";

/** Tooltip showing the signed change and the running total. */
export function WaterfallTooltip({
  active,
  payload,
  format,
}: Partial<TooltipContentProps<number, string>> & {
  format: (value: number) => string;
}) {
  const row = payload?.[0]?.payload as WaterfallRow | undefined;
  if (!active || !row) return null;
  const isTotal = row.category === "total";

  return (
    <div className="grid min-w-32 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <div className="font-medium">{row.label}</div>
      <div className="flex items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: waterfallConfig[row.category].color }}
        />
        <span className="flex-1 text-muted-foreground">
          {waterfallConfig[row.category].label}
        </span>
        <span className="font-mono font-medium tabular-nums">
          {isTotal ? format(row.amount) : formatSigned(row.amount, format)}
        </span>
      </div>
      {!isTotal && (
        <div className="flex justify-between gap-2 text-muted-foreground">
          <span>Running total</span>
          <span className="font-mono tabular-nums">{format(row.end)}</span>
        </div>
      )}
    </div>
  );
}
