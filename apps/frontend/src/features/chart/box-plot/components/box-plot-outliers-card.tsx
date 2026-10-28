"use client";

import { CartesianGrid, ComposedChart, Scatter, XAxis, YAxis } from "recharts";

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
  outlierPoints,
} from "@/features/chart/box-plot/utils/box-plot";
import { buildMinutes } from "@/mocks/chart-box-plot.mock";

const chartConfig = {
  box: { label: "Build duration", color: "var(--chart-2)" },
  outlier: { label: "Outlier", color: "var(--destructive)" },
} satisfies ChartConfig;

// Tukey fences: whiskers stop at 1.5 × IQR, the rest become outliers.
const rows: BoxPlotRow[] = buildMinutes.map((group) => ({
  label: group.label,
  box: computeBoxStats(group.samples, { fences: true }),
}));
const outliers = outlierPoints(rows);

const formatMinutes = (value: number) => `${Math.round(value * 10) / 10} min`;

export function BoxPlotOutliersCard() {
  return (
    <ChartCard
      title="CI build duration"
      description="Outliers — runs beyond 1.5 × IQR plotted as points"
      value={`${outliers.length} outliers`}
      footer="Whiskers end at the last run inside the Tukey fences."
    >
      <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
        <ComposedChart
          data={rows}
          accessibilityLayer
          margin={{ top: 8, left: -8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            type="category"
            allowDuplicatedCategory={false}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
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
                format={formatMinutes}
              />
            }
          />
          {BoxPlotBars({ statsKey: "box", color: "var(--color-box)" })}
          <Scatter
            data={outliers}
            dataKey="value"
            name="outlier"
            fill="var(--color-outlier)"
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
    </ChartCard>
  );
}
