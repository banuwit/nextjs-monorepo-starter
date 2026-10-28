"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { monthlyOrdersRevenue } from "@/mocks/chart-bar.mock";

const ordersRevenueConfig = {
  orders: { label: "Orders", color: "var(--chart-2)" },
  revenue: { label: "Revenue ($K)", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function BarBiaxialCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Orders and revenue"
      description="Biaxial bar — orders on the left Y axis, revenue in $K on the right"
      value={`$${sumBy(monthlyOrdersRevenue, (row) => row.revenue).toFixed(1)}K`}
      change={8.9}
      footer="Revenue grows faster than the order count."
    >
      <ChartContainer config={ordersRevenueConfig} className="h-64 w-full">
        <BarChart
          data={monthlyOrdersRevenue}
          accessibilityLayer
          margin={{ left: -20, right: -20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            yAxisId="orders"
            tickLine={false}
            axisLine={false}
            hide={legend.isHidden("orders")}
          />
          <YAxis
            yAxisId="revenue"
            orientation="right"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `$${value}K`}
            hide={legend.isHidden("revenue")}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            yAxisId="orders"
            dataKey="orders"
            fill="var(--color-orders)"
            radius={4}
            hide={legend.isHidden("orders")}
          />
          <Bar
            yAxisId="revenue"
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={4}
            hide={legend.isHidden("revenue")}
          />
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(ordersRevenueConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
