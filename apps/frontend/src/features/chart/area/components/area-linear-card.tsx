"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sumBy } from "@/features/chart/utils/format";
import { monthlySignups } from "@/mocks/chart-area.mock";

const signupsConfig = {
  signups: { label: "Sign-ups", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function AreaLinearCard() {
  return (
    <ChartCard
      title="Sign-ups"
      description='Linear — type="linear" single series, tooltip without indicator'
      value={sumBy(monthlySignups, (row) => row.signups).toLocaleString(
        "en-US",
      )}
      change={12.6}
    >
      <ChartContainer config={signupsConfig} className="h-64 w-full">
        <AreaChart
          data={monthlySignups}
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
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideIndicator />}
          />
          <Area
            dataKey="signups"
            type="linear"
            fill="var(--color-signups)"
            fillOpacity={0.3}
            stroke="var(--color-signups)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
