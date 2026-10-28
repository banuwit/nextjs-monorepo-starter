"use client";

import { BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { BoxPlotBars } from "@/features/chart/box-plot/components/box-plot-bars";
import { BoxPlotTooltip } from "@/features/chart/box-plot/components/box-plot-tooltip";
import type { BoxPlotRow } from "@/features/chart/box-plot/types/box-plot";
import {
  boxAxis,
  computeBoxStats,
} from "@/features/chart/box-plot/utils/box-plot";
import { endpointLatency } from "@/mocks/chart-box-plot.mock";

const chartConfig = {
  box: { label: "Response time", color: "var(--chart-3)" },
} satisfies ChartConfig;

const rows: BoxPlotRow[] = endpointLatency.map((group) => ({
  label: group.label,
  box: computeBoxStats(group.samples),
}));

const formatMs = (value: number) => `${Math.round(value)} ms`;
const slowest = rows.reduce((top, row) =>
  row.box.median > top.box.median ? row : top,
);

export function BoxPlotBasicCard() {
  return (
    <ChartCard
      title="API response time"
      description="Basic — min, Q1, median, Q3 and max per endpoint"
      value={formatMs(slowest.box.median)}
      footer={`Highest median: ${slowest.label}. Whiskers span the full min → max.`}
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
        <BarChart data={rows} accessibilityLayer margin={{ top: 8, left: -8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
            fontSize={11}
          />
          <YAxis
            {...boxAxis(rows.map((row) => row.box))}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
            content={
              <BoxPlotTooltip
                series={[{ key: "box", ...chartConfig.box }]}
                format={formatMs}
              />
            }
          />
          {BoxPlotBars({ statsKey: "box", color: "var(--color-box)" })}
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
