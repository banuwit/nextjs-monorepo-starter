"use client";

import { Bar, BarChart, Cell, ReferenceLine, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import {
  miniSparklineConfig,
  toSeries,
} from "@/features/chart/sparkline/utils/mini-sparkline";

/** Win/loss bars: positive values go up, negative values go down in red. */
export function WinLossSparkline({
  results,
  className = "h-8 w-full",
}: {
  results: number[];
  className?: string;
}) {
  const data = toSeries(results);

  return (
    <ChartContainer
      config={miniSparklineConfig}
      className={`aspect-auto ${className}`}
    >
      <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <YAxis hide domain={[-1, 1]} />
        <ReferenceLine y={0} stroke="var(--border)" />
        <Bar dataKey="value" isAnimationActive={false}>
          {data.map((point) => (
            <Cell
              key={point.index}
              fill={
                point.value < 0 ? "var(--color-negative)" : "var(--color-value)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
