import { cn } from "@/lib/utils";

import type { KpiItem } from "../types/dashboard";
import { Sparkline } from "./sparkline";
import { TrendDelta } from "./trend-delta";

/**
 * Headline numbers in one surface. Cells share hairline dividers instead of
 * floating as separate cards, so the row reads as a single summary.
 */
export function KpiStrip({
  items,
  label,
  className,
}: {
  items: readonly KpiItem[];
  label: string;
  className?: string;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        "grid gap-px overflow-hidden rounded-xl bg-border ring-1 ring-foreground/10 sm:grid-cols-2",
        items.length === 3 ? "lg:grid-cols-3" : "xl:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-w-0 items-end justify-between gap-3 bg-card p-4 text-card-foreground"
        >
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
            {(item.delta || item.context) && (
              <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                {item.delta && <TrendDelta delta={item.delta} />}
                {item.context && <span>{item.context}</span>}
              </p>
            )}
          </div>
          {item.trend && <Sparkline values={item.trend} className="mb-1 shrink-0" />}
        </div>
      ))}
    </section>
  );
}
