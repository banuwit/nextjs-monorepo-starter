"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
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
import { sumBy } from "@/features/chart/utils/format";
import { monthlyCashFlow } from "@/mocks/chart-bar.mock";

const cashFlowConfig = {
  sales: { label: "Sales", color: "var(--chart-1)" },
  services: { label: "Services", color: "var(--chart-2)" },
  refunds: { label: "Refunds", color: "var(--chart-7)" },
  costs: { label: "Costs", color: "var(--chart-5)" },
} satisfies ChartConfig;

type Series = keyof typeof cashFlowConfig;

const net = sumBy(
  monthlyCashFlow,
  (row) => row.sales + row.services + row.refunds + row.costs,
);

export function BarStackedSignCard() {
  const legend = useChartLegendToggle();

  // Each stack keeps its radius on the outer end: up for inflows, down for outflows.
  const bar = (key: Series, radius: [number, number, number, number]) => (
    <Bar
      dataKey={key}
      stackId="flow"
      fill={`var(--color-${key})`}
      radius={radius}
      hide={legend.isHidden(key)}
    />
  );

  return (
    <ChartCard
      title="Cash flow"
      description='Stacked by sign — stackOffset="sign" stacks inflows up and outflows down (in $K)'
      value={`$${net}K`}
      change={5.3}
      footer="Net cash flow, January – June."
    >
      <ChartContainer config={cashFlowConfig} className="h-64 w-full">
        <BarChart
          data={monthlyCashFlow}
          stackOffset="sign"
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
          <ReferenceLine y={0} stroke="var(--muted-foreground)" />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          {bar("services", [0, 0, 0, 0])}
          {bar("sales", [4, 4, 0, 0])}
          {bar("refunds", [0, 0, 0, 0])}
          {bar("costs", [0, 0, 4, 4])}
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(cashFlowConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
