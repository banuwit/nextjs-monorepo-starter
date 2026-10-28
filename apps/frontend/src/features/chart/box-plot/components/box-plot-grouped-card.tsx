"use client";

import { BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { BoxPlotBars } from "@/features/chart/box-plot/components/box-plot-bars";
import { BoxPlotTooltip } from "@/features/chart/box-plot/components/box-plot-tooltip";
import type { BoxPlotGroupedRow } from "@/features/chart/box-plot/types/box-plot";
import {
  boxAxis,
  computeBoxStats,
} from "@/features/chart/box-plot/utils/box-plot";
import { pageLoadByRelease } from "@/mocks/chart-box-plot.mock";

const chartConfig = {
  current: { label: "v2.4 (this release)", color: "var(--chart-4)" },
  previous: { label: "v2.3 (last release)", color: "var(--chart-2)" },
} satisfies ChartConfig;

const seriesKeys = ["current", "previous"] as const;

const rows: BoxPlotGroupedRow[] = pageLoadByRelease.map((group) => ({
  label: group.label,
  current: computeBoxStats(group.current),
  previous: computeBoxStats(group.previous),
}));

const axis = boxAxis(rows.flatMap((row) => [row.current, row.previous]));
const overallMedian = (key: (typeof seriesKeys)[number]) =>
  computeBoxStats(pageLoadByRelease.flatMap((group) => group[key])).median;
const currentMedian = overallMedian("current");
const medianChange =
  ((currentMedian - overallMedian("previous")) / overallMedian("previous")) *
  100;

const formatMs = (value: number) => `${Math.round(value)} ms`;
const formatSeconds = (value: number) => `${(value / 1000).toFixed(1)}s`;

export function BoxPlotGroupedCard() {
  const legend = useChartLegendToggle();
  const visible = seriesKeys.filter((key) => !legend.isHidden(key));

  return (
    <ChartCard
      title="Page load time"
      description="Grouped — this release against the last one, per page"
      value={formatMs(currentMedian)}
      change={Math.round(medianChange * 10) / 10}
      footer="Overall median load time; a negative change means faster pages."
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
        <BarChart
          data={rows}
          accessibilityLayer
          barGap={6}
          margin={{ top: 8, left: -8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            {...axis}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatSeconds}
            width={48}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
            content={
              <BoxPlotTooltip
                series={visible.map((key) => ({ key, ...chartConfig[key] }))}
                format={formatMs}
              />
            }
          />
          {visible.map((key) =>
            BoxPlotBars({
              statsKey: key,
              color: `var(--color-${key})`,
              name: chartConfig[key].label,
              maxBarSize: 28,
            }),
          )}
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(chartConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
