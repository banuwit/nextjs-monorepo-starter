"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CandlestickBars } from "@/features/chart/candlestick/components/candlestick-bars";
import { CandlestickTooltip } from "@/features/chart/candlestick/components/candlestick-tooltip";
import {
  candleColor,
  formatCandleDate,
  formatVolume,
  priceDomain,
} from "@/features/chart/candlestick/utils/candlestick";
import {
  candlestickConfig,
  formatPriceTick,
} from "@/features/chart/candlestick/utils/candlestick-config";
import { sumBy } from "../utils/format";
import { dailyCandles } from "@/mocks/chart-candlestick.mock";

const candles = dailyCandles.slice(-60);
const totalVolume = sumBy(candles, (candle) => candle.volume ?? 0);

const axisProps = {
  dataKey: "time",
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  minTickGap: 48,
  tickFormatter: (value: string) => formatCandleDate(value),
} as const;

export function CandlestickVolumeCard() {
  return (
    <ChartCard
      className="@4xl/main:col-span-2"
      title="Price and volume"
      description="Volume panel — daily candles with a synced volume chart below, colored by direction"
      value={formatVolume(totalVolume)}
      footer="Last 60 trading days. Hover either panel to highlight the same day in both."
    >
      <ChartContainer
        config={candlestickConfig}
        className="aspect-auto h-56 w-full"
      >
        <BarChart
          data={candles}
          syncId="candles-volume"
          accessibilityLayer
          margin={{ top: 8, left: -12, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis {...axisProps} hide />
          <YAxis
            domain={priceDomain(candles)}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatPriceTick}
            width={56}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
            content={
              <CandlestickTooltip
                formatLabel={(time) => formatCandleDate(time, "long")}
              />
            }
          />
          {CandlestickBars({ maxBarSize: 10 })}
        </BarChart>
      </ChartContainer>
      <ChartContainer
        config={candlestickConfig}
        className="mt-1 aspect-auto h-24 w-full"
      >
        <BarChart
          data={candles}
          syncId="candles-volume"
          accessibilityLayer
          margin={{ left: -12, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis {...axisProps} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={formatVolume}
            ticks={[0, 3_000_000]}
            width={56}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
            content={
              <ChartTooltipContent
                hideIndicator
                labelFormatter={(value) =>
                  formatCandleDate(String(value), "long")
                }
                formatter={(value) => formatVolume(Number(value))}
              />
            }
          />
          <Bar
            dataKey="volume"
            name="Volume"
            maxBarSize={10}
            radius={[2, 2, 0, 0]}
            isAnimationActive={false}
          >
            {candles.map((candle) => (
              <Cell
                key={candle.time}
                fill={candleColor(candle)}
                fillOpacity={0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
