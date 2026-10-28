"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import { ticketsResolved } from "@/mocks/chart-line.mock";

const ticketsConfig = {
  thisYear: { label: "This year", color: "var(--chart-2)" },
  lastYear: { label: "Last year", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

export function LineVerticalCard() {
  const legend = useChartLegendToggle();
  const thisYear = sumBy(ticketsResolved, (row) => row.thisYear);
  const lastYear = sumBy(ticketsResolved, (row) => row.lastYear);

  return (
    <ChartCard
      title="Tickets resolved"
      description='Vertical — layout="vertical" puts the categories on the Y axis'
      value={thisYear.toLocaleString("en-US")}
      change={((thisYear - lastYear) / lastYear) * 100}
      footer="Swap the axes: XAxis is type number, YAxis is type category."
    >
      <ChartContainer config={ticketsConfig} className="h-64 w-full">
        <LineChart
          data={ticketsResolved}
          layout="vertical"
          accessibilityLayer
          margin={{ left: -20, right: 12 }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            dataKey="month"
            type="category"
            padding={{ top: 12, bottom: 12 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="lastYear"
            type="linear"
            stroke="var(--color-lastYear)"
            strokeDasharray="4 4"
            strokeWidth={2}
            dot={false}
            hide={legend.isHidden("lastYear")}
          />
          <Line
            dataKey="thisYear"
            type="linear"
            stroke="var(--color-thisYear)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--color-thisYear)" }}
            hide={legend.isHidden("thisYear")}
          />
        </LineChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(ticketsConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
