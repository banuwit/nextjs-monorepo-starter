"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { dailyTemperatureRange } from "@/mocks/chart-bar.mock";

const temperatureConfig = {
  range: { label: "Temperature", color: "var(--chart-3)" },
} satisfies ChartConfig;

const lows = dailyTemperatureRange.map((row) => row.range[0] ?? 0);
const highs = dailyTemperatureRange.map((row) => row.range[1] ?? 0);

export function BarRangedCard() {
  return (
    <ChartCard
      title="Daily temperature"
      description="Ranged bar — a [min, max] value draws each bar from the low to the high"
      value={`${Math.min(...lows)}° – ${Math.max(...highs)}°`}
      footer="Low and high temperature this week, in °C."
    >
      <ChartContainer config={temperatureConfig} className="h-64 w-full">
        <BarChart
          data={dailyTemperatureRange}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            domain={[15, 35]}
            tickFormatter={(value: number) => `${value}°`}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => {
                  const [low, high] = value as unknown as [number, number];
                  return (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">Low – high</span>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {low}° – {high}°
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
          <Bar dataKey="range" fill="var(--color-range)" radius={6} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
