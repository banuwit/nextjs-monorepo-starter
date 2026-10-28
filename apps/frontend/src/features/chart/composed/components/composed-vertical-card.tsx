"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

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
import { sumBy } from "@/features/chart/utils/format";
import { regionSales } from "@/mocks/chart-composed.mock";

const regionConfig = {
  sales: { label: "Sales", color: "var(--chart-2)" },
  target: { label: "Target", color: "var(--foreground)" },
} satisfies ChartConfig;

export function ComposedVerticalCard() {
  const legend = useChartLegendToggle();
  const sales = sumBy(regionSales, (row) => row.sales);
  const target = sumBy(regionSales, (row) => row.target);

  return (
    <ChartCard
      title="Sales by region"
      description="Vertical composed — horizontal bars with a target line (layout=vertical)"
      value={`$${sales}K`}
      change={((sales - target) / target) * 100}
      footer="EMEA and LATAM are below their quarterly target."
    >
      <ChartContainer config={regionConfig} className="h-64 w-full">
        <ComposedChart
          data={regionSales}
          layout="vertical"
          accessibilityLayer
          margin={{ left: 0, right: 8 }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis
            dataKey="region"
            type="category"
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="sales"
            fill="var(--color-sales)"
            radius={4}
            maxBarSize={24}
            hide={legend.isHidden("sales")}
          />
          <Line
            dataKey="target"
            type="monotone"
            stroke="var(--color-target)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={{ r: 3, fill: "var(--color-target)" }}
            hide={legend.isHidden("target")}
          />
        </ComposedChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(regionConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
