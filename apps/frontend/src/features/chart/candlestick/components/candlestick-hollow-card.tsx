"use client";

import { BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { CandlestickBars } from "@/features/chart/candlestick/components/candlestick-bars";
import { CandlestickTooltip } from "@/features/chart/candlestick/components/candlestick-tooltip";
import {
  formatCandleDate,
  priceDomain,
} from "@/features/chart/candlestick/utils/candlestick";
import {
  candlestickConfig,
  formatPrice,
  formatPriceTick,
} from "@/features/chart/candlestick/utils/candlestick-config";
import { weeklyCandles } from "@/mocks/chart-candlestick.mock";

const first = weeklyCandles[0]!;
const last = weeklyCandles.at(-1)!;
const yearChange = ((last.close - first.open) / first.open) * 100;
const yearHigh = Math.max(...weeklyCandles.map((candle) => candle.high));

export function CandlestickHollowCard() {
  return (
    <ChartCard
      title="Weekly, hollow style"
      description="Hollow — up weeks are outlined, down weeks are filled; dashed line marks the 52-week high"
      value={formatPrice(last.close)}
      change={Math.round(yearChange * 10) / 10}
      footer={`52-week high ${formatPrice(yearHigh)}.`}
    >
      <ChartContainer config={candlestickConfig} className="h-64 w-full">
        <BarChart
          data={weeklyCandles}
          accessibilityLayer
          margin={{ top: 8, left: -12, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={48}
            tickFormatter={(value: string) => formatCandleDate(value)}
          />
          <YAxis
            domain={priceDomain(weeklyCandles)}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatPriceTick}
            width={56}
          />
          <ReferenceLine
            y={yearHigh}
            stroke="var(--muted-foreground)"
            strokeDasharray="3 3"
            label={{
              value: "52w high",
              position: "insideTopLeft",
              fontSize: 11,
              fill: "var(--muted-foreground)",
            }}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
            content={
              <CandlestickTooltip
                formatLabel={(time) =>
                  `Week of ${formatCandleDate(time, "long")}`
                }
              />
            }
          />
          {CandlestickBars({ hollow: true, maxBarSize: 10 })}
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
