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
import { sumBy } from "../utils/format";
import { salesVsGoal } from "@/mocks/chart.mock";

const salesConfig = {
  sales: { label: "Sales", color: "var(--chart-2)" },
  goal: { label: "Goal", color: "var(--foreground)" },
} satisfies ChartConfig;

export function ComposedGoalLineCard() {
  const legend = useChartLegendToggle();
  const sales = sumBy(salesVsGoal, (row) => row.sales);
  const goal = sumBy(salesVsGoal, (row) => row.goal);

  return (
    <ChartCard
      title="Sales vs goal"
      description="Bars for actual sales, line for the monthly goal ($K)"
      value={`$${sales}K`}
      change={((sales - goal) / goal) * 100}
      footer={`${Math.round((sales / goal) * 100)}% of the half-year goal reached.`}
    >
      <ChartContainer config={salesConfig} className="h-64 w-full">
        <ComposedChart
          data={salesVsGoal}
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
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="sales"
            fill="var(--color-sales)"
            radius={4}
            maxBarSize={36}
            hide={legend.isHidden("sales")}
          />
          <Line
            dataKey="goal"
            type="monotone"
            stroke="var(--color-goal)"
            strokeWidth={2}
            strokeDasharray="5 4"
            dot={false}
            hide={legend.isHidden("goal")}
          />
        </ComposedChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(salesConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
