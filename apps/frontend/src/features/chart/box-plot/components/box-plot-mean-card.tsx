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
  boxIqr,
  computeBoxStats,
} from "@/features/chart/box-plot/utils/box-plot";
import { orderValueByChannel } from "@/mocks/chart-box-plot.mock";

const chartConfig = {
  box: { label: "Order value", color: "var(--chart-5)" },
} satisfies ChartConfig;

const rows: BoxPlotRow[] = orderValueByChannel.map((group) => ({
  label: group.label,
  box: computeBoxStats(group.samples),
}));

const overall = computeBoxStats(
  orderValueByChannel.flatMap((group) => group.samples),
);

const formatDollars = (value: number) => `$${Math.round(value)}`;

export function BoxPlotMeanCard() {
  return (
    <ChartCard
      title="Order value"
      description="Mean — mean marker over the box with an IQR readout"
      value={`${formatDollars(overall.mean!)} avg`}
      footer="Hollow dot = mean, line = median. A mean above the median signals a long tail of large orders."
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
        <BarChart data={rows} accessibilityLayer margin={{ top: 8, left: -8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            {...boxAxis(rows.map((row) => row.box))}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatDollars}
            width={48}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
            content={
              <BoxPlotTooltip
                series={[{ key: "box", ...chartConfig.box }]}
                format={formatDollars}
                showMean
              />
            }
          />
          {BoxPlotBars({
            statsKey: "box",
            color: "var(--color-box)",
            showMean: true,
          })}
        </BarChart>
      </ChartContainer>
      <dl className="grid grid-cols-3 gap-2 pt-3 text-xs sm:grid-cols-5">
        {rows.map((row) => (
          <div key={row.label} className="rounded-md bg-muted/50 px-2 py-1.5">
            <dt className="truncate text-muted-foreground">{row.label} IQR</dt>
            <dd className="font-mono font-medium tabular-nums">
              {formatDollars(boxIqr(row.box))}
            </dd>
          </div>
        ))}
      </dl>
    </ChartCard>
  );
}
