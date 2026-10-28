"use client";

import { BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { WaterfallBars } from "@/features/chart/waterfall/components/waterfall-bars";
import { WaterfallTooltip } from "@/features/chart/waterfall/components/waterfall-tooltip";
import { useWaterfallLegend } from "@/features/chart/waterfall/hooks/use-waterfall-legend";
import { computeWaterfall } from "@/features/chart/waterfall/utils/waterfall";
import {
  waterfallConfig,
  waterfallCategories,
  formatThousands,
} from "@/features/chart/waterfall/utils/waterfall-config";
import { cashBalance } from "@/mocks/chart-waterfall.mock";

const cashRows = computeWaterfall(cashBalance);

export function WaterfallCashBridgeCard() {
  const legend = useWaterfallLegend();

  return (
    <ChartCard
      className="@4xl/main:col-span-2"
      title="Cash balance"
      description="Monthly bridge — opening balance, monthly net flow, closing"
      value={formatThousands(cashRows.at(-1)!.end)}
      change={12.5}
      footer="First half of the year, in thousands of USD."
    >
      {/* Eight waterfallCategories need width; scroll horizontally on narrow screens. */}
      <div className="-mx-1 overflow-x-auto px-1">
        <ChartContainer
          config={waterfallConfig}
          className="aspect-auto h-64 w-full min-w-[32rem]"
        >
          <BarChart
            data={cashRows}
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
            {WaterfallBars({
              isHidden: legend.isHidden,
              format: formatThousands,
            })}
          </BarChart>
        </ChartContainer>
      </div>
      {legend.toggle}
    </ChartCard>
  );
}
