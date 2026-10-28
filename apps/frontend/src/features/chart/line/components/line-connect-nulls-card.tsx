"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
import { regionLatency } from "@/mocks/chart-line.mock";

const latencyConfig = {
  eu: { label: "EU (gaps)", color: "var(--chart-2)" },
  us: { label: "US (connectNulls)", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function LineConnectNullsCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="p95 latency"
      description="Connect nulls — days without data break the line, or are bridged with connectNulls"
      value="170 ms"
      change={-3.2}
      footer="Dots mark real samples, so you can see where each line is interpolated."
    >
      <ChartContainer config={latencyConfig} className="h-64 w-full">
        <LineChart
          data={regionLatency}
          accessibilityLayer
          margin={{ left: -12, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={16}
          />
          <YAxis
            domain={[140, 200]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `${value}ms`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="eu"
            type="monotone"
            stroke="var(--color-eu)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--color-eu)" }}
            hide={legend.isHidden("eu")}
          />
          <Line
            dataKey="us"
            type="monotone"
            connectNulls
            stroke="var(--color-us)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--color-us)" }}
            hide={legend.isHidden("us")}
          />
        </LineChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(latencyConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
