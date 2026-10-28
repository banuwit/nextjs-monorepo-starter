"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  formatPercent,
  withConversion,
} from "@/features/chart/funnel/utils/funnel";
import { signupFunnel } from "@/mocks/chart-funnel.mock";

const horizontalConfig = {
  value: { label: "Users", color: "var(--chart-3)" },
} satisfies ChartConfig;

const signupRates = withConversion(signupFunnel, (row) => row.users);

export function FunnelHorizontalCard() {
  return (
    <ChartCard
      title="Activation path"
      description="Horizontal bars — stage values with overall conversion labels"
      footer="Readable on small screens: one row per stage."
    >
      <ChartContainer
        config={horizontalConfig}
        className="aspect-auto h-64 w-full"
      >
        <BarChart
          data={signupRates}
          layout="vertical"
          accessibilityLayer
          margin={{ left: 0, right: 72 }}
        >
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <XAxis dataKey="value" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel={false} />}
          />
          <Bar dataKey="value" fill="var(--color-value)" radius={4}>
            <LabelList
              dataKey="overallRate"
              position="right"
              className="fill-foreground"
              fontSize={12}
              formatter={(value) => formatPercent(Number(value))}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
