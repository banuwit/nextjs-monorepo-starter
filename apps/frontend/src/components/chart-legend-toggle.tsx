"use client";

import { useCallback, useState, type ReactNode } from "react";
import { cn } from "cn";

import type { ChartConfig } from "@/components/ui/chart";

export type ChartLegendItem = {
  key: string;
  label: ReactNode;
  color: string;
  /** Optional value column, e.g. amount. */
  value?: ReactNode;
  /** Optional percent share column. */
  share?: number;
};

/**
 * Tracks which series/items are hidden. Pass `isHidden(key)` to the Recharts
 * series `hide` prop, or use it to filter data for Pie/Treemap/Sankey.
 */
export function useChartLegendToggle() {
  const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set());

  const toggle = useCallback((key: string) => {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const isHidden = useCallback((key: string) => hidden.has(key), [hidden]);

  return { hidden, isHidden, toggle };
}

/** Builds legend items from the series entries of a `ChartConfig`. */
export function legendItemsFromConfig(
  config: ChartConfig,
  keys: string[] = Object.keys(config),
): ChartLegendItem[] {
  return keys.flatMap((key) => {
    const item = config[key];
    const color = item?.color;
    return item && color ? [{ key, label: item.label ?? key, color }] : [];
  });
}

/**
 * Clickable legend: each item toggles its series. Shown items use normal
 * text; hidden items are muted. Renders inline chips, or a list with
 * value/share columns when `variant="list"`.
 */
export function ChartLegendToggle({
  items,
  isHidden,
  onToggle,
  variant = "inline",
  className,
}: {
  items: ChartLegendItem[];
  isHidden: (key: string) => boolean;
  onToggle: (key: string) => void;
  variant?: "inline" | "list";
  className?: string;
}) {
  const isList = variant === "list";

  return (
    <ul
      className={cn(
        isList
          ? "grid gap-1 text-sm"
          : "flex flex-wrap items-center justify-center gap-x-1 gap-y-1 pt-3 text-xs",
        className,
      )}
    >
      {items.map((item) => {
        const hidden = isHidden(item.key);
        return (
          <li key={item.key}>
            <button
              type="button"
              aria-pressed={!hidden}
              onClick={() => onToggle(item.key)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left transition-[color,opacity] hover:bg-muted/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                hidden ? "text-muted-foreground opacity-50" : "text-foreground",
              )}
            >
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-[2px] transition-opacity",
                  hidden && "opacity-30",
                )}
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className={cn(isList && "min-w-0 flex-1 truncate")}>
                {item.label}
              </span>
              {item.value !== undefined && (
                <span className="font-medium tabular-nums">{item.value}</span>
              )}
              {item.share !== undefined && (
                <span className="w-12 text-right text-muted-foreground tabular-nums">
                  {hidden ? "—" : `${item.share.toFixed(1)}%`}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
