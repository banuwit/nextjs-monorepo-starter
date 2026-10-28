"use client";

import { ChartCard } from "@/components/chart-card";
import { TargetSparkline } from "@/features/chart/sparkline/components/target-sparkline";
import { targetMetrics } from "@/mocks/chart-sparkline.mock";

export function SparklineTargetCard() {
  return (
    <ChartCard
      title="SLO targets"
      description="Target line & band — dashed target with a shaded goal range"
    >
      <div className="grid gap-4 @xl/main:grid-cols-2">
        {targetMetrics.map((item) => (
          <div key={item.key} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
              <span className="text-lg font-semibold tabular-nums">
                {item.value}
              </span>
            </div>
            <TargetSparkline
              points={item.points}
              target={item.target}
              band={item.band}
            />
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
