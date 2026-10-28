"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

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
import { latencyRange } from "@/mocks/chart-composed.mock";

const rangeConfig = {
  range: { label: "Min – max", color: "var(--chart-2)" },
  average: { label: "Average", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function ComposedRangeBandCard() {
  const legend = useChartLegendToggle();
  const average = Math.round(
    sumBy(latencyRange, (row) => row.average) / latencyRange.length,
  );

  return (
    <ChartCard
      title="Response time spread"
      description="Range band — min/max area ([min, max] dataKey) with an average line (ms)"
      value={`${average} ms`}
      change={-4.2}
      footer="The band widens mid-week when traffic peaks."
    >
      <ChartContainer config={rangeConfig} className="h-64 w-full">
        <ComposedChart
          data={latencyRange}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="range"
            type="monotone"
            fill="var(--color-range)"
            fillOpacity={0.3}
            stroke="none"
            hide={legend.isHidden("range")}
          />
          <Line
            dataKey="average"
            type="monotone"
            stroke="var(--color-average)"
            strokeWidth={2}
            dot={false}
            hide={legend.isHidden("average")}
          />
        </ComposedChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(rangeConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
