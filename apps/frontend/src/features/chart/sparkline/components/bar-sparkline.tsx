"use client";

import { Bar, BarChart, Cell, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import {
  miniSparklineConfig,
  toSeries,
} from "@/features/chart/sparkline/utils/mini-sparkline";

/** Tiny column chart; the last bar is highlighted. */
export function BarSparkline({
  points,
  className = "h-10 w-full",
}: {
  points: number[];
  className?: string;
}) {
  const data = toSeries(points);

  return (
    <ChartContainer
      config={miniSparklineConfig}
      className={`aspect-auto ${className}`}
    >
      <BarChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <YAxis hide domain={[0, "dataMax"]} />
        <Bar dataKey="value" radius={2} isAnimationActive={false}>
          {data.map((point) => (
            <Cell
              key={point.index}
              fill={
                point.index === data.length - 1
                  ? "var(--color-latest)"
                  : "var(--color-value)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
