"use client";

import { ChartCard } from "@/components/chart/chart-card";
import { MarkerSparkline } from "@/features/chart/sparkline/components/marker-sparkline";
import { priceSeries } from "@/mocks/chart-sparkline.mock";

export function SparklineMarkersCard() {
  return (
    <ChartCard
      title="Watchlist"
      description="Min/max markers — high, low and end-point dots on a line"
      footer="Green dot = period high, red dot = period low, ring = latest."
    >
      <div className="grid gap-4 @xl/main:grid-cols-2">
        {priceSeries.map((item) => {
          const high = Math.max(...item.points);
          const low = Math.min(...item.points);
          return (
            <div key={item.key} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-lg font-semibold tabular-nums">
                  {item.value}
                </span>
              </div>
              <MarkerSparkline points={item.points} />
              <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
                <span>L {low}</span>
                <span>H {high}</span>
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}
