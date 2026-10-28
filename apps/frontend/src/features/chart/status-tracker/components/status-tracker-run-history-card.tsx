"use client";

import { cn } from "cn";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RunStatus } from "@/features/chart/status-tracker/types/status-tracker";
import {
  countBy,
  formatDuration,
} from "@/features/chart/status-tracker/utils/status-tracker";
import { runHistory } from "@/mocks/chart-status-tracker.mock";

const runStatusMeta: Record<
  RunStatus,
  { label: string; className: string; color: string }
> = {
  success: {
    label: "Success",
    className: "bg-chart-1",
    color: "var(--chart-1)",
  },
  failed: {
    label: "Failed",
    className: "bg-destructive",
    color: "var(--destructive)",
  },
  running: {
    label: "Running",
    className: "animate-pulse bg-chart-2",
    color: "var(--chart-2)",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-muted-foreground",
    color: "var(--muted-foreground)",
  },
};

export function StatusTrackerRunHistoryCard() {
  const legend = useChartLegendToggle();
  const finished = runHistory.filter(
    (run) => run.status === "success" || run.status === "failed",
  );
  const successRate =
    (finished.filter((run) => run.status === "success").length /
      finished.length) *
    100;
  const longest = Math.max(...runHistory.map((run) => run.duration));
  const counts = countBy(runHistory, (run) => run.status);

  return (
    <ChartCard
      title="CI runs"
      description="Run history — last 18 runs, bar height is duration"
      value={`${successRate.toFixed(0)}%`}
      footer="Success rate of finished runs on all branches."
    >
      <div className="flex h-24 items-end gap-1">
        {runHistory.map((run) => {
          const meta = runStatusMeta[run.status];
          return (
            <Tooltip key={run.id}>
              <TooltipTrigger
                render={
                  <div
                    tabIndex={0}
                    aria-label={`Run #${run.id}: ${meta.label}`}
                    className={cn(
                      "min-w-0 flex-1 rounded-full transition-opacity outline-none hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring",
                      legend.isHidden(run.status) ? "bg-muted" : meta.className,
                    )}
                    // Height is data-driven; keep a minimum so short runs stay visible.
                    style={{
                      height: `${Math.max((run.duration / longest) * 100, 12)}%`,
                    }}
                  />
                }
              />
              <TooltipContent className="flex-col items-start gap-0.5">
                <span className="font-medium">
                  #{run.id} · {meta.label}
                </span>
                <span>
                  {run.branch} · {formatDuration(run.duration)}
                </span>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>Oldest</span>
        <span>Latest</span>
      </div>
      <ChartLegendToggle
        items={(Object.keys(runStatusMeta) as RunStatus[]).map((key) => ({
          key,
          label: runStatusMeta[key].label,
          color: runStatusMeta[key].color,
          value: counts[key] ?? 0,
        }))}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
