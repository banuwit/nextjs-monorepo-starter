"use client";

import { BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { WaterfallBars } from "@/features/chart/waterfall/components/waterfall-bars";
import { WaterfallTooltip } from "@/features/chart/waterfall/components/waterfall-tooltip";
import { useWaterfallLegend } from "@/features/chart/waterfall/hooks/use-waterfall-legend";
import {
  computeWaterfall,
  waterfallConnectors,
} from "@/features/chart/waterfall/utils/waterfall";
import {
  waterfallConfig,
  formatThousands,
  formatNumber,
} from "@/features/chart/waterfall/utils/waterfall-config";
import { arrBridge } from "@/mocks/chart-waterfall.mock";

const arrRows = computeWaterfall(arrBridge);

const arrConnectors = waterfallConnectors(arrRows);

export function WaterfallConnectorCard() {
  const legend = useWaterfallLegend();

  return (
    <ChartCard
      title="ARR bridge"
      description="Connector lines — dashed steps link each bar to the next"
      value={formatThousands(arrRows.at(-1)!.end)}
      change={19.2}
      footer="Annual recurring revenue, Q2 to Q3, in thousands of USD."
    >
      {/* Category labels need width; scroll horizontally on narrow screens. */}
      <div className="-mx-1 overflow-x-auto px-1">
        <ChartContainer
          config={waterfallConfig}
          className="aspect-auto h-64 w-full min-w-[30rem]"
        >
          <BarChart
            data={arrRows}
            accessibilityLayer
            margin={{ top: 20, left: -4, right: 8 }}
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
              ticks={[0, 1000, 2000, 3000]}
              tickFormatter={formatThousands}
            />
            <ChartTooltip
              cursor={false}
              content={<WaterfallTooltip format={formatThousands} />}
            />
            {WaterfallBars({ isHidden: legend.isHidden, format: formatNumber })}
            {arrConnectors.map((segment) => (
              <ReferenceLine
                key={segment.from}
                segment={[
                  { x: segment.from, y: segment.value },
                  { x: segment.to, y: segment.value },
                ]}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
      {legend.toggle}
    </ChartCard>
  );
}
