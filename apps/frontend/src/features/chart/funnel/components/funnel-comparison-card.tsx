"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { formatCompact } from "@/features/chart/utils/format";
import { funnelComparison } from "@/mocks/chart-funnel.mock";

const comparisonConfig = {
  current: { label: "This month", color: "var(--chart-4)" },
  previous: { label: "Last month", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function FunnelComparisonCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Month over month"
      description="Comparison — two periods per stage; toggle a period in the legend"
    >
      <ChartContainer
        config={comparisonConfig}
        className="aspect-auto h-64 w-full"
      >
        <BarChart
          data={funnelComparison}
          layout="vertical"
          accessibilityLayer
          barGap={2}
          margin={{ left: 0, right: 16 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="stage"
            type="category"
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCompact(Number(value))}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar
            dataKey="current"
            fill="var(--color-current)"
            radius={4}
            hide={legend.isHidden("current")}
          />
          <Bar
            dataKey="previous"
            fill="var(--color-previous)"
            radius={4}
            hide={legend.isHidden("previous")}
          />
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(comparisonConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
