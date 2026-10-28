"use client";

import { Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import {
  miniSparklineConfig,
  toSeries,
} from "@/features/chart/sparkline/utils/mini-sparkline";

/** Line sparkline with min/max markers and an end-point dot. */
export function MarkerSparkline({
  points,
  className = "h-12 w-full",
}: {
  points: number[];
  className?: string;
}) {
  const data = toSeries(points);
  const minIndex = points.indexOf(Math.min(...points));
  const maxIndex = points.indexOf(Math.max(...points));
  const lastIndex = points.length - 1;

  return (
    <ChartContainer
      config={miniSparklineConfig}
      className={`aspect-auto ${className}`}
    >
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <XAxis dataKey="index" hide />
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Line
          dataKey="value"
          type="monotone"
          stroke="var(--color-value)"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
        <ReferenceDot
          x={maxIndex}
          y={points[maxIndex]}
          r={3}
          fill="var(--color-latest)"
          stroke="none"
        />
        <ReferenceDot
          x={minIndex}
          y={points[minIndex]}
          r={3}
          fill="var(--color-negative)"
          stroke="none"
        />
        <ReferenceDot
          x={lastIndex}
          y={points[lastIndex]}
          r={4}
          fill="var(--background)"
          stroke="var(--foreground)"
          strokeWidth={1.5}
        />
      </LineChart>
    </ChartContainer>
  );
}
