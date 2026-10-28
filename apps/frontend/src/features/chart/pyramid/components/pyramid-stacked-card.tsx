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
  type ChartConfig,
} from "@/components/ui/chart";
import { PyramidTooltip } from "@/features/chart/pyramid/components/pyramid-tooltip";
import {
  formatAbs,
  mirrorRows,
  symmetricScale,
} from "@/features/chart/pyramid/utils/pyramid";
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import { customersByAgePlan } from "@/mocks/chart-pyramid.mock";

const planConfig = {
  menPaid: { label: "Men · Paid", color: "var(--chart-5)" },
  menFree: { label: "Men · Free", color: "var(--chart-3)" },
  womenFree: { label: "Women · Free", color: "var(--chart-2)" },
  womenPaid: { label: "Women · Paid", color: "var(--chart-4)" },
} satisfies ChartConfig;

const leftKeys = ["menFree", "menPaid"];
const rightKeys = ["womenFree", "womenPaid"];
const rows = mirrorRows(customersByAgePlan, leftKeys);
const { domain, ticks } = symmetricScale(customersByAgePlan, [
  leftKeys,
  rightKeys,
]);
const paid = sumBy(customersByAgePlan, (row) => row.menPaid + row.womenPaid);

export function PyramidStackedCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Customers by plan"
      description="Stacked — age band × plan segment stacked on each side"
      value={formatCompact(paid)}
      change={4.6}
      footer="Paid customers. Negative values stack left, positive stack right."
    >
      <ChartContainer config={planConfig} className="aspect-auto h-64 w-full">
        <BarChart
          data={rows}
          layout="vertical"
          stackOffset="sign"
          accessibilityLayer
          margin={{ left: 0, right: 12 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="label"
            type="category"
            reversed
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <XAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatAbs(value)}
          />
          <ChartTooltip
            cursor={false}
            content={<PyramidTooltip config={planConfig} />}
          />
          {/* Inner segments first so free plans sit next to the axis. */}
          {["menFree", "menPaid", "womenFree", "womenPaid"].map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={`var(--color-${key})`}
              hide={legend.isHidden(key)}
            />
          ))}
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(planConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
