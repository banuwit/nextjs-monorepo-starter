"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard, ChartPeriodTabs } from "@/components/chart/chart-card";
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
import { monthlyVisitors } from "@/mocks/chart.mock";

const visitorsConfig = {
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  mobile: { label: "Mobile", color: "var(--chart-4)" },
} satisfies ChartConfig;

const layouts = [
  { value: "grouped", label: "Grouped" },
  { value: "stacked", label: "Stacked" },
] as const;

type Layout = (typeof layouts)[number]["value"];

export function BarGroupedStackedCard() {
  const legend = useChartLegendToggle();
  const [layout, setLayout] = useState<Layout>("grouped");
  const stackId = layout === "stacked" ? "visitors" : undefined;

  return (
    <ChartCard
      title="Visitors by device"
      description="January – June"
      value={sumBy(
        monthlyVisitors,
        (row) => row.desktop + row.mobile,
      ).toLocaleString("en-US")}
      change={4.8}
      action={
        <ChartPeriodTabs
          label="Layout"
          value={layout}
          options={layouts}
          onValueChange={setLayout}
        />
      }
    >
      <ChartContainer config={visitorsConfig} className="h-64 w-full">
        <BarChart
          data={monthlyVisitors}
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
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            dataKey="desktop"
            stackId={stackId}
            fill="var(--color-desktop)"
            radius={stackId ? [0, 0, 4, 4] : 4}
            hide={legend.isHidden("desktop")}
          />
          <Bar
            dataKey="mobile"
            stackId={stackId}
            fill="var(--color-mobile)"
            radius={stackId ? [4, 4, 0, 0] : 4}
            hide={legend.isHidden("mobile")}
          />
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(visitorsConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
