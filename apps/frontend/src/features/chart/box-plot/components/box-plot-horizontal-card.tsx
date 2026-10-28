"use client";

import { BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
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
import { deliveryDays } from "@/mocks/chart-box-plot.mock";

const chartConfig = {
  box: { label: "Delivery time", color: "var(--chart-4)" },
} satisfies ChartConfig;

const rows: BoxPlotRow[] = deliveryDays.map((group) => ({
  label: group.label,
  box: computeBoxStats(group.samples),
}));

const formatDays = (value: number) =>
  `${Math.round(value * 10) / 10} ${value === 1 ? "day" : "days"}`;
const overall = computeBoxStats(deliveryDays.flatMap((group) => group.samples));

export function BoxPlotHorizontalCard() {
  return (
    <ChartCard
      title="Delivery time"
      description="Horizontal — days from dispatch to doorstep per region"
      value={formatDays(overall.median)}
      footer="Median across all regions. Longer whiskers mean less predictable delivery."
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
        <BarChart
          data={rows}
          layout="vertical"
          accessibilityLayer
          margin={{ left: 0, right: 16 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            axisLine={false}
            width={96}
          />
          <XAxis
            type="number"
            {...boxAxis(rows.map((row) => row.box))}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `${value}d`}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
            content={
              <BoxPlotTooltip
                series={[{ key: "box", ...chartConfig.box }]}
                format={formatDays}
              />
            }
          />
          {BoxPlotBars({
            statsKey: "box",
            color: "var(--color-box)",
            horizontal: true,
            maxBarSize: 24,
          })}
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
