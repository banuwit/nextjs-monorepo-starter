import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { logisticsStages } from "@/mocks/dashboard-logistics.mock";

import { stageShare } from "../utils/logistics";

const barColor = {
  picked: "bg-muted-foreground",
  "in-transit": "bg-chart-2",
  "out-for-delivery": "bg-chart-3",
  delivered: "bg-chart-1",
  failed: "bg-destructive",
} as const;

export function LogisticsStages() {
  const total = logisticsStages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <section
      aria-label="Shipments by stage"
      className="rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10"
    >
      <ol className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-5">
        {logisticsStages.map((stage, index) => {
          const share = stageShare(stage.count, total);
          const failed = stage.key === "failed";
          return (
            <li
              key={stage.key}
              className="relative flex min-w-0 flex-col gap-2 pr-6"
            >
              {index < logisticsStages.length - 1 && (
                <ChevronRightIcon
                  aria-hidden="true"
                  className="absolute top-1 right-1 hidden size-4 text-muted-foreground/60 sm:block"
                />
              )}
              <p className="truncate text-xs text-muted-foreground">
                {stage.label}
              </p>
              <p
                className={cn(
                  "text-2xl font-semibold tabular-nums",
                  failed && "text-destructive",
                )}
              >
                {stage.count}
              </p>
              <div
                role="meter"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={share}
                aria-label={`${stage.label}: ${share}% of today's shipments`}
                className="h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn("h-full rounded-full", barColor[stage.key])}
                  style={{ width: `${share}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground tabular-nums">
                {share}% of {total}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
