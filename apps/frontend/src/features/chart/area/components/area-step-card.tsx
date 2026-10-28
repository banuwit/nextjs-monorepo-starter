"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { sumBy } from "@/features/chart/utils/format";
import { deploysByEnvironment } from "@/mocks/chart-area.mock";

const deploysConfig = {
  production: { label: "Production", color: "var(--chart-2)" },
  staging: { label: "Staging", color: "var(--chart-6)" },
} satisfies ChartConfig;

export function AreaStepCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Deployments"
      description='Step — type="step" with stacked series'
      value={sumBy(
        deploysByEnvironment,
        (row) => row.production + row.staging,
      ).toLocaleString("en-US")}
      change={8.4}
      footer="Step areas suit discrete counts that change between periods."
    >
      <ChartContainer config={deploysConfig} className="h-64 w-full">
        <AreaChart
          data={deploysByEnvironment}
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
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="staging"
            type="step"
            stackId="deploys"
            fill="var(--color-staging)"
            fillOpacity={0.4}
            stroke="var(--color-staging)"
            hide={legend.isHidden("staging")}
          />
          <Area
            dataKey="production"
            type="step"
            stackId="deploys"
            fill="var(--color-production)"
            fillOpacity={0.4}
            stroke="var(--color-production)"
            hide={legend.isHidden("production")}
          />
        </AreaChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(deploysConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
