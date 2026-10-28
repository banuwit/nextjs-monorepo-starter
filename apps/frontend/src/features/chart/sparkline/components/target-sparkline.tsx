"use client";

import { Line, LineChart, ReferenceArea, ReferenceLine, YAxis } from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import {
  miniSparklineConfig,
  toSeries,
} from "@/features/chart/sparkline/utils/mini-sparkline";

/** Line sparkline with a dashed target line and a shaded goal band. */
export function TargetSparkline({
  points,
  target,
  band,
  className = "h-12 w-full",
}: {
  points: number[];
  target: number;
  band: readonly [number, number];
  className?: string;
}) {
  const data = toSeries(points);
  const min = Math.min(...points, target);
  const max = Math.max(...points, target);
  const padding = (max - min) * 0.1;

  return (
    <ChartContainer
      config={miniSparklineConfig}
      className={`aspect-auto ${className}`}
    >
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <YAxis hide domain={[min - padding, max + padding]} />
        <ReferenceArea
          y1={band[0]}
          y2={band[1]}
          fill="var(--color-value)"
          fillOpacity={0.12}
          ifOverflow="hidden"
        />
        <ReferenceLine
          y={target}
          stroke="var(--foreground)"
          strokeDasharray="3 3"
        />
        <Line
          dataKey="value"
          type="monotone"
          stroke="var(--color-latest)"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
}
