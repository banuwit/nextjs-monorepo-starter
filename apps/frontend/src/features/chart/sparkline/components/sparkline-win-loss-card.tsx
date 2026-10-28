"use client";

import { ChartCard } from "@/components/chart-card";
import { WinLossSparkline } from "@/features/chart/sparkline/components/win-loss-sparkline";
import { deployResults } from "@/mocks/chart-sparkline.mock";

export function SparklineWinLossCard() {
  return (
    <ChartCard
      title="Deploy history"
      description="Win/loss bars — success up, failure down, last 15 runs"
    >
      <ul className="divide-y">
        {deployResults.map((item) => {
          const passed = item.results.filter((result) => result > 0).length;
          return (
            <li key={item.pipeline} className="flex items-center gap-4 py-2.5">
              <span className="w-20 shrink-0 truncate text-sm font-medium">
                {item.pipeline}
              </span>
              <WinLossSparkline
                results={item.results}
                className="h-8 min-w-0 flex-1"
              />
              <span className="w-12 text-right text-sm text-muted-foreground tabular-nums">
                {Math.round((passed / item.results.length) * 100)}%
              </span>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}
