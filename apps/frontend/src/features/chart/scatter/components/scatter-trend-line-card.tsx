"use client";

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";

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
import { responseTimes } from "@/mocks/chart.mock";

const latencyConfig = {
  latency: { label: "Latency (ms)", color: "var(--chart-3)" },
  trend: { label: "Trend", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

export function ScatterTrendLineCard() {
  const first = responseTimes[0];
  const last = responseTimes[responseTimes.length - 1];
  const trend = first && last ? [first, last] : [];
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Latency vs payload"
      description="Scatter with a trend line"
      value="~9.8 ms / MB"
      footer="Latency grows roughly linearly with payload size."
    >
      <ChartContainer config={latencyConfig} className="h-64 w-full">
        <ScatterChart
          accessibilityLayer
          margin={{ left: -12, right: 8, top: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="payload"
            type="number"
            unit=" MB"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="latency"
            type="number"
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Scatter
            dataKey="latency"
            name="latency"
            data={responseTimes}
            fill="var(--color-latency)"
            hide={legend.isHidden("latency")}
          />
          <Scatter
            data={trend}
            line={{ stroke: "var(--color-trend)", strokeDasharray: "4 4" }}
            shape={() => <g />}
            legendType="none"
            tooltipType="none"
            hide={legend.isHidden("trend")}
          />
        </ScatterChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(latencyConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
