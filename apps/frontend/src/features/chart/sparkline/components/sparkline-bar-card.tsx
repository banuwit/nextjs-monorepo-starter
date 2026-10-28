"use client";

import { Bar } from "recharts";

import { ChartCard } from "@/components/chart-card";
import { BarSparkline } from "@/features/chart/sparkline/components/bar-sparkline";
import { dailyVolumes } from "@/mocks/chart-sparkline.mock";

export function SparklineBarCard() {
  return (
    <ChartCard
      title="Daily volumes"
      description="Bar sparkline — tiny columns, latest day highlighted"
    >
      <div className="grid gap-4 @xl/main:grid-cols-3">
        {dailyVolumes.map((item) => (
          <div key={item.key} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
              <span className="text-lg font-semibold tabular-nums">
                {item.value}
              </span>
            </div>
            <BarSparkline points={item.points} />
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
