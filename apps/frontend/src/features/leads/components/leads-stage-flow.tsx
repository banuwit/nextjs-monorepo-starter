import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lead, Pipeline } from "../types/leads";
import { formatCompactCurrency, stageTotals } from "../utils/leads";
import { stageTones } from "../utils/stage-tones";

/** Open stages as a left-to-right flow, then the won/lost outcomes. */
export function LeadsStageFlow({ pipeline, leads }: { pipeline: Pipeline; leads: Lead[] }) {
  const totals = stageTotals(pipeline, leads);
  const open = totals.filter(({ stage }) => stage.kind === "open");
  const closed = totals.filter(({ stage }) => stage.kind !== "open");
  const max = Math.max(1, ...open.map(({ count }) => count));

  return (
    <ol aria-label="Alur tahap pipeline" className="flex flex-wrap items-stretch gap-1.5">
      {open.map(({ stage, count, value }, index) => (
        <li key={stage.id} className="flex min-w-32 flex-1 items-center gap-1.5">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg border bg-background px-3 py-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="truncate font-medium">{stage.name}</span>
              <span className="text-muted-foreground tabular-nums">{stage.probability}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", stageTones[stage.tone].bar)}
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground tabular-nums">
              <span className="font-medium text-foreground">{count}</span> lead ·{" "}
              {formatCompactCurrency(value)}
            </p>
          </div>
          {index < open.length - 1 && (
            <ChevronRightIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
          )}
        </li>
      ))}
      <li aria-hidden className="mx-1 hidden w-px self-stretch bg-border sm:block" />
      {closed.map(({ stage, count, value }) => (
        <li
          key={stage.id}
          className={cn(
            "flex min-w-28 flex-col justify-center gap-0.5 rounded-lg px-3 py-2 text-xs",
            stageTones[stage.tone].soft,
          )}
        >
          <span className="font-medium">{stage.name}</span>
          <span className="tabular-nums">
            {count} lead · {formatCompactCurrency(value)}
          </span>
        </li>
      ))}
    </ol>
  );
}
