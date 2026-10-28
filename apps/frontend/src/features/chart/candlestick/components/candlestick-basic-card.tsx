"use client";

import { BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { CandlestickBars } from "@/features/chart/candlestick/components/candlestick-bars";
import { CandlestickTooltip } from "@/features/chart/candlestick/components/candlestick-tooltip";
import {
  candleChange,
  formatCandleTime,
  priceDomain,
} from "@/features/chart/candlestick/utils/candlestick";
import {
  candlestickConfig,
  formatPrice,
} from "@/features/chart/candlestick/utils/candlestick-config";
import { intradayCandles } from "@/mocks/chart-candlestick.mock";

const first = intradayCandles[0]!;
const last = intradayCandles.at(-1)!;
const sessionChange = ((last.close - first.open) / first.open) * 100;

export function CandlestickBasicCard() {
  return (
    <ChartCard
      title="Intraday session"
      description="Basic — 5-minute OHLC candles for one trading day"
      value={formatPrice(last.close)}
      change={Math.round(sessionChange * 10) / 10}
      footer={`Last candle ${candleChange(last, intradayCandles.at(-2)).toFixed(2)}% against the previous close.`}
    >
      <ChartContainer config={candlestickConfig} className="h-64 w-full">
        <BarChart
          data={intradayCandles}
          accessibilityLayer
          margin={{ top: 8, left: -8, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={40}
            tickFormatter={formatCandleTime}
          />
          <YAxis
            domain={priceDomain(intradayCandles)}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatPrice}
            width={64}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
            content={<CandlestickTooltip formatLabel={formatCandleTime} />}
          />
          {CandlestickBars({ maxBarSize: 8 })}
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
