"use client";

import { Area, AreaChart, Line, LineChart, YAxis } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

const sparkConfig = {
  value: { label: "Value", color: "var(--chart-2)" },
  negative: { label: "Value", color: "var(--destructive)" },
} satisfies ChartConfig;

function toSeries(points: number[]) {
  return points.map((value, index) => ({ index, value }));
}

/** Tiny chart without axes, grid, or tooltip; size it with `className`. */
export function Sparkline({
  points,
  variant = "area",
  negative = false,
  className = "h-10 w-full",
}: {
  points: number[];
  variant?: "area" | "line";
  negative?: boolean;
  className?: string;
}) {
  const color = negative ? "var(--color-negative)" : "var(--color-value)";
  const data = toSeries(points);

  return (
    <ChartContainer config={sparkConfig} className={`aspect-auto ${className}`}>
      {variant === "area" ? (
        <AreaChart
          data={data}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
        >
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Area
            dataKey="value"
            type="monotone"
            stroke={color}
            strokeWidth={1.5}
            fill={color}
            fillOpacity={0.15}
            isAnimationActive={false}
          />
        </AreaChart>
      ) : (
        <LineChart
          data={data}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        >
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            dataKey="value"
            type="monotone"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      )}
    </ChartContainer>
  );
}
