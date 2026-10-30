"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { revenueComparison } from "@/mocks/chart.mock";

const revenueConfig = {
  current: { label: "This period", color: "var(--chart-2)" },
  previous: { label: "Previous period", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const periods = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
] as const;

type Period = (typeof periods)[number]["value"];

export function AreaComparisonCard() {
  const legend = useChartLegendToggle();
  const [period, setPeriod] = useState<Period>("week");
  const data = revenueComparison[period];
  const current = sumBy(data, (row) => row.current);
  const previous = sumBy(data, (row) => row.previous);

  return (
    <ChartCard
      title="Revenue"
      description="Current vs previous period (in $K)"
      value={`$${current.toFixed(1)}K`}
      change={((current - previous) / previous) * 100}
      action={
        <ChartPeriodTabs
          value={period}
          options={periods}
          onValueChange={setPeriod}
        />
      }
      footer="The dashed line shows the previous period for comparison."
    >
      <ChartContainer config={revenueConfig} className="h-64 w-full">
        <AreaChart
          data={data}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Area
            dataKey="previous"
            type="monotone"
            fill="none"
            stroke="var(--color-previous)"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
            hide={legend.isHidden("previous")}
          />
          <Area
            dataKey="current"
            type="monotone"
            fill="var(--color-current)"
            fillOpacity={0.2}
            stroke="var(--color-current)"
            strokeWidth={2}
            hide={legend.isHidden("current")}
          />
        </AreaChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(revenueConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
