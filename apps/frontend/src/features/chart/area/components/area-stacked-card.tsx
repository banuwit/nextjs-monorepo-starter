"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { monthlyVisitors } from "@/mocks/chart.mock";

const visitorsConfig = {
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  mobile: { label: "Mobile", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function AreaStackedCard() {
  const legend = useChartLegendToggle();
  const total = sumBy(monthlyVisitors, (row) => row.desktop + row.mobile);

  return (
    <ChartCard
      title="Visitors"
      description="Stacked area with gradient fill, January – June"
      value={total.toLocaleString("en-US")}
      change={5.2}
      footer="Click a legend item to hide or show its series."
    >
      <ChartContainer config={visitorsConfig} className="h-64 w-full">
        <AreaChart
          data={monthlyVisitors}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <defs>
            {Object.keys(visitorsConfig).map((key) => (
              <linearGradient
                key={key}
                id={`fill-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.05}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="mobile"
            type="natural"
            stackId="visitors"
            fill="url(#fill-mobile)"
            stroke="var(--color-mobile)"
            hide={legend.isHidden("mobile")}
          />
          <Area
            dataKey="desktop"
            type="natural"
            stackId="visitors"
            fill="url(#fill-desktop)"
            stroke="var(--color-desktop)"
            hide={legend.isHidden("desktop")}
          />
        </AreaChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(visitorsConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
