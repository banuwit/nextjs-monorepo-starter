"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
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
import { cashflow } from "@/mocks/chart.mock";

const cashflowConfig = {
  inflow: { label: "Inflow", color: "var(--chart-1)" },
  outflow: { label: "Outflow", color: "var(--destructive)" },
  net: { label: "Net", color: "var(--foreground)" },
} satisfies ChartConfig;

export function ComposedCashflowCard() {
  const legend = useChartLegendToggle();
  const net = sumBy(cashflow, (row) => row.net);

  return (
    <ChartCard
      title="Cashflow"
      description="Inflow and outflow bars with a net line ($K)"
      value={`$${net}K`}
      change={9.6}
      footer="March closed with a negative net cashflow."
    >
      <ChartContainer config={cashflowConfig} className="h-64 w-full">
        <ComposedChart
          data={cashflow}
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
          <ReferenceLine y={0} stroke="var(--border)" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="inflow"
            stackId="flow"
            fill="var(--color-inflow)"
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
            hide={legend.isHidden("inflow")}
          />
          <Bar
            dataKey="outflow"
            stackId="flow"
            fill="var(--color-outflow)"
            fillOpacity={0.7}
            radius={[0, 0, 4, 4]}
            maxBarSize={36}
            hide={legend.isHidden("outflow")}
          />
          <Line
            dataKey="net"
            type="monotone"
            stroke="var(--color-net)"
            strokeWidth={2}
            hide={legend.isHidden("net")}
          />
        </ComposedChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(cashflowConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
