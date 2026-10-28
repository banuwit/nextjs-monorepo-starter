"use client";

import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

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
import { dealsByStage } from "@/mocks/chart.mock";

const dealsConfig = {
  won: { label: "Won", color: "var(--chart-1)" },
  open: { label: "Open", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ScatterBubbleCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Deals pipeline"
      description="Bubble chart: size vs probability, bubble = deal value"
      footer="Larger bubbles are higher-value deals."
    >
      <ChartContainer config={dealsConfig} className="h-64 w-full">
        <ScatterChart
          accessibilityLayer
          margin={{ left: -12, right: 8, top: 8 }}
        >
          <CartesianGrid />
          <XAxis
            dataKey="size"
            type="number"
            name="Seats"
            unit=" seats"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="probability"
            type="number"
            name="Probability"
            unit="%"
            tickLine={false}
            axisLine={false}
          />
          <ZAxis
            dataKey="value"
            type="number"
            range={[60, 400]}
            name="Value ($K)"
          />
          <ChartTooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<ChartTooltipContent hideLabel />}
          />
          <Scatter
            name="won"
            data={dealsByStage.won}
            fill="var(--color-won)"
            fillOpacity={0.7}
            hide={legend.isHidden("won")}
          />
          <Scatter
            name="open"
            data={dealsByStage.open}
            fill="var(--color-open)"
            fillOpacity={0.7}
            hide={legend.isHidden("open")}
          />
        </ScatterChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(dealsConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
