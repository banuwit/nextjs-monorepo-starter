"use client";

import { ChartCard } from "@/components/chart-card";
import { Sparkline } from "@/features/chart/sparkline/components/sparkline";
import { serviceSparklines } from "@/mocks/chart.mock";

export function SparklineServiceListCard() {
  return (
    <ChartCard
      title="Service latency"
      description="Inline line sparklines inside a list, last 7 days"
    >
      <ul className="divide-y">
        {serviceSparklines.map((item) => (
          <li key={item.service} className="flex items-center gap-4 py-2.5">
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {item.service}
            </span>
            <Sparkline
              points={item.points}
              variant="line"
              className="h-8 w-28"
            />
            <span className="w-16 text-right text-sm text-muted-foreground tabular-nums">
              {item.latency}
            </span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
