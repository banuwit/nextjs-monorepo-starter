"use client";

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cohortNps } from "@/mocks/chart-scatter.mock";

const npsConfig = {
  guided: { label: "Guided onboarding", color: "var(--chart-2)" },
  selfServe: { label: "Self-serve", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function ScatterJointLineCard() {
  const legend = useChartLegendToggle();
  const guided = cohortNps.guided[cohortNps.guided.length - 1];

  return (
    <ChartCard
      title="Cohort NPS"
      description="Joint line — points connected per series with the Scatter line prop"
      value={guided?.score}
      change={71.9}
      footer="The guided cohort keeps improving week over week."
    >
      <ChartContainer config={npsConfig} className="h-64 w-full">
        <ScatterChart
          accessibilityLayer
          margin={{ left: -20, right: 8, top: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="week"
            type="number"
            name="Week"
            domain={[1, 6]}
            tickCount={6}
            tickFormatter={(value) => `W${value}`}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="score"
            type="number"
            name="NPS"
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Scatter
            name="guided"
            data={cohortNps.guided}
            fill="var(--color-guided)"
            line={{ stroke: "var(--color-guided)", strokeWidth: 2 }}
            lineJointType="monotoneX"
            hide={legend.isHidden("guided")}
          />
          <Scatter
            name="selfServe"
            data={cohortNps.selfServe}
            fill="var(--color-selfServe)"
            line={{ stroke: "var(--color-selfServe)", strokeWidth: 2 }}
            lineJointType="monotoneX"
            hide={legend.isHidden("selfServe")}
          />
        </ScatterChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(npsConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
