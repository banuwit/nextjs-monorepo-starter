"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { conversionRate } from "@/mocks/chart-line.mock";

const conversionConfig = {
  rate: { label: "Conversion (%)", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function LineLinearDotsCard() {
  return (
    <ChartCard
      title="Checkout conversion"
      description='Linear with dots — type="linear" with visible dots and active dot'
      value="4.2%"
      change={10.5}
      footer="The tooltip uses labelFormatter to expand the week label."
    >
      <ChartContainer config={conversionConfig} className="h-64 w-full">
        <LineChart
          data={conversionRate}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `${value}%`}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(value) =>
                  `Week ${String(value).replace("W", "")}`
                }
              />
            }
          />
          <Line
            dataKey="rate"
            type="linear"
            stroke="var(--color-rate)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--color-rate)" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
