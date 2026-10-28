"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { pricingTiers } from "@/mocks/chart-line.mock";

const priceConfig = {
  price: { label: "Price ($)", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function LineStepCard() {
  return (
    <ChartCard
      title="Pro plan price"
      description='Step — type="step" for values that change in discrete jumps, tooltip without label'
      value="$39"
      change={21.9}
    >
      <ChartContainer config={priceConfig} className="h-64 w-full">
        <LineChart
          data={pricingTiers}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={[20, 45]}
            ticks={[20, 25, 30, 35, 40, 45]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `$${value}`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="price"
            type="step"
            stroke="var(--color-price)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
