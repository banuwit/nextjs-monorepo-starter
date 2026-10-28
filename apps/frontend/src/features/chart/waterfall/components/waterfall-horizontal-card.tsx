"use client";

import { BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { WaterfallBars } from "@/features/chart/waterfall/components/waterfall-bars";
import { WaterfallTooltip } from "@/features/chart/waterfall/components/waterfall-tooltip";
import { useWaterfallLegend } from "@/features/chart/waterfall/hooks/use-waterfall-legend";
import { computeWaterfall } from "@/features/chart/waterfall/utils/waterfall";
import {
  waterfallConfig,
  formatNumber,
} from "@/features/chart/waterfall/utils/waterfall-config";
import { headcountBridge } from "@/mocks/chart-waterfall.mock";

const headcountRows = computeWaterfall(headcountBridge);

export function WaterfallHorizontalCard() {
  const legend = useWaterfallLegend();

  return (
    <ChartCard
      title="Headcount"
      description="Horizontal — top-to-bottom bridge with long category labels"
      value={headcountRows.at(-1)!.end}
      footer="Engineering headcount since January."
    >
      <ChartContainer
        config={waterfallConfig}
        className="aspect-auto h-64 w-full"
      >
        <BarChart
          data={headcountRows}
          layout="vertical"
          accessibilityLayer
          margin={{ left: 0, right: 32 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            axisLine={false}
            width={104}
          />
          <XAxis type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<WaterfallTooltip format={formatNumber} />}
          />
          {WaterfallBars({
            isHidden: legend.isHidden,
            format: formatNumber,
            horizontal: true,
          })}
        </BarChart>
      </ChartContainer>
      {legend.toggle}
    </ChartCard>
  );
}
