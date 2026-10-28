"use client";

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { customerSegments } from "@/mocks/chart-scatter.mock";

const segmentsConfig = {
  starter: { label: "Starter", color: "var(--chart-1)" },
  pro: { label: "Pro", color: "var(--chart-3)" },
  enterprise: { label: "Enterprise", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function ScatterMultiGroupCard() {
  const legend = useChartLegendToggle();
  const groups = Object.keys(segmentsConfig) as Array<
    keyof typeof segmentsConfig
  >;

  return (
    <ChartCard
      title="Customer segments"
      description="Multi-group — one Scatter per plan on shared axes"
      footer="Engagement and order value both scale with the plan tier."
    >
      <ChartContainer config={segmentsConfig} className="h-64 w-full">
        <ScatterChart
          accessibilityLayer
          margin={{ left: -12, right: 8, top: 8 }}
        >
          <CartesianGrid />
          <XAxis
            dataKey="sessions"
            type="number"
            name="Sessions / week"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="order"
            type="number"
            name="Avg. order ($)"
            tickFormatter={(value) => `$${value}`}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<ChartTooltipContent hideLabel />}
          />
          {groups.map((key) => (
            <Scatter
              key={key}
              name={key}
              data={customerSegments[key]}
              fill={`var(--color-${key})`}
              hide={legend.isHidden(key)}
            />
          ))}
        </ScatterChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(segmentsConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
