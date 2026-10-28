"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { cn } from "cn";

import { ChartCard } from "@/components/chart/chart-card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useLiveSeries } from "@/features/chart/line/hooks/use-live-series";

const cpuConfig = {
  value: { label: "CPU (%)", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function LineLiveCard() {
  const { points, isLive } = useLiveSeries({ size: 30, intervalMs: 1500 });
  const latest = points[points.length - 1]?.value ?? 0;
  // Compare with the window average: steadier than the oldest point.
  const average = points.length
    ? points.reduce((sum, point) => sum + point.value, 0) / points.length
    : 0;

  return (
    <ChartCard
      title="CPU usage"
      description="Live — a new point every 1.5s, keeping the last 30 points"
      className="@4xl/main:col-span-2"
      value={`${latest}%`}
      change={average ? ((latest - average) / average) * 100 : 0}
      action={
        <Badge variant={isLive ? "secondary" : "outline"}>
          <span
            className={cn(
              "size-2 rounded-full",
              isLive ? "bg-chart-3" : "bg-muted-foreground",
            )}
            aria-hidden="true"
          />
          {isLive ? "Live" : "Paused"}
        </Badge>
      }
      footer="Change compares the latest value with the window average. Updates pause while the tab is hidden or when reduced motion is preferred."
    >
      <ChartContainer config={cpuConfig} className="h-64 w-full">
        <LineChart
          data={points}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `${value}%`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="value"
            type="monotone"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
