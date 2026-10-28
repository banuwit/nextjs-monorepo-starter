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
  formatThousands,
  formatNumber,
} from "@/features/chart/waterfall/utils/waterfall-config";
import { profitAndLoss } from "@/mocks/chart-waterfall.mock";

const pnlRows = computeWaterfall(profitAndLoss);

export function WaterfallProfitLossCard() {
  const legend = useWaterfallLegend();

  return (
    <ChartCard
      title="Profit & loss"
      description="Classic P&L — revenue to net income with subtotals"
      value={formatThousands(pnlRows.at(-1)!.end)}
      change={6.2}
      footer="Q3, in thousands of USD."
    >
      {/* Category labels need width; scroll horizontally on narrow screens. */}
      <div className="-mx-1 overflow-x-auto px-1">
        <ChartContainer
          config={waterfallConfig}
          className="aspect-auto h-64 w-full min-w-[28rem]"
        >
          <BarChart
            data={pnlRows}
            accessibilityLayer
            margin={{ top: 20, left: -12, right: 8 }}
          >
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
              tickLine={false}
              axisLine={false}
              tickFormatter={formatThousands}
            />
            <ChartTooltip
              cursor={false}
              content={<WaterfallTooltip format={formatThousands} />}
            />
            {WaterfallBars({ isHidden: legend.isHidden, format: formatNumber })}
          </BarChart>
        </ChartContainer>
      </div>
      {legend.toggle}
    </ChartCard>
  );
}
