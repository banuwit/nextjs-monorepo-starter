"use client";

import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  LoaderCircleIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

import { ChartCard } from "@/components/chart-card";
import type { StageStatus } from "@/features/chart/status-tracker/types/status-tracker";
import { formatDuration } from "@/features/chart/status-tracker/utils/status-tracker";
import { deployPipeline } from "@/mocks/chart-status-tracker.mock";

const stageStatusMeta: Record<
  StageStatus,
  { label: string; icon: LucideIcon; className: string; barClassName: string }
> = {
  success: {
    label: "Passed",
    icon: CircleCheckIcon,
    className: "text-chart-4",
    barClassName: "bg-chart-3",
  },
  running: {
    label: "Running",
    icon: LoaderCircleIcon,
    className: "animate-spin text-foreground",
    barClassName: "animate-pulse bg-chart-1",
  },
  failed: {
    label: "Failed",
    icon: CircleXIcon,
    className: "text-destructive",
    barClassName: "bg-destructive",
  },
  pending: {
    label: "Pending",
    icon: CircleDashedIcon,
    className: "text-muted-foreground",
    barClassName: "bg-muted",
  },
};

export function StatusTrackerPipelineCard() {
  const done = deployPipeline.filter((stage) => stage.status === "success");
  const elapsed = deployPipeline.reduce(
    (total, stage) => total + (stage.duration ?? 0),
    0,
  );

  return (
    <ChartCard
      title="Deploy #1200"
      description="Pipeline stages — status icon and duration per step"
      value={`${done.length} / ${deployPipeline.length}`}
      footer={`Elapsed ${formatDuration(elapsed)} on main.`}
    >
      <div className="flex gap-1" aria-hidden="true">
        {deployPipeline.map((stage) => (
          <div
            key={stage.stage}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              stageStatusMeta[stage.status].barClassName,
            )}
          />
        ))}
      </div>
      <ol className="mt-4 grid gap-1">
        {deployPipeline.map((stage) => {
          const meta = stageStatusMeta[stage.status];
          const Icon = meta.icon;
          return (
            <li
              key={stage.stage}
              className="flex items-center gap-3 rounded-md px-1.5 py-1.5 text-sm"
            >
              <Icon
                className={cn("size-4 shrink-0", meta.className)}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "flex-1 font-medium",
                  stage.status === "pending" && "text-muted-foreground",
                )}
              >
                {stage.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {meta.label}
              </span>
              <span className="w-14 text-right text-muted-foreground tabular-nums">
                {stage.duration === undefined
                  ? "—"
                  : formatDuration(stage.duration)}
              </span>
            </li>
          );
        })}
      </ol>
    </ChartCard>
  );
}
