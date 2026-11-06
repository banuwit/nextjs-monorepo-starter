import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { hrPipeline } from "@/mocks/dashboard-hr.mock";

import { integer } from "../utils/format";
import { stageConversion } from "../utils/hr";

const barColor = {
  applied: "bg-muted-foreground",
  screening: "bg-chart-2",
  interview: "bg-chart-3",
  offer: "bg-chart-4",
  hired: "bg-chart-1",
} as const;

export function HrHiringPipeline() {
  return (
    <section
      aria-label="Hiring pipeline this quarter"
      className="rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10"
    >
      <ol className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-5">
        {hrPipeline.map((stage, index) => {
          const conversion = stageConversion(hrPipeline, index);
          const previous = hrPipeline[index - 1];
          return (
            <li
              key={stage.key}
              className="relative flex min-w-0 flex-col gap-2 pr-6"
            >
              {index < hrPipeline.length - 1 && (
                <ChevronRightIcon
                  aria-hidden="true"
                  className="absolute top-1 right-1 hidden size-4 text-muted-foreground/60 sm:block"
                />
              )}
              <p className="truncate text-xs text-muted-foreground">
                {stage.label}
              </p>
              <p className="text-2xl font-semibold tabular-nums">
                {integer.format(stage.count)}
              </p>
              <div
                role="meter"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={conversion ?? 100}
                aria-label={
                  conversion === null || !previous
                    ? `${stage.label}: start of the pipeline`
                    : `${stage.label}: ${conversion}% of ${previous.label.toLowerCase()} candidates`
                }
                className="h-1.5 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className={cn("h-full rounded-full", barColor[stage.key])}
                  style={{ width: `${conversion ?? 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground tabular-nums">
                {conversion === null || !previous
                  ? "All candidates"
                  : `${conversion}% from ${previous.label.toLowerCase()}`}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
