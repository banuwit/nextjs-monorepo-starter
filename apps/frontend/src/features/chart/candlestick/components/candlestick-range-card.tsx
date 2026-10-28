"use client";

import { useState } from "react";
import { BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

import { ChartCard, ChartPeriodTabs } from "@/components/chart-card";
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
import { dailyCandles } from "@/mocks/chart-candlestick.mock";

const periods = [
  { value: "1m", label: "1M", days: 21 },
  { value: "3m", label: "3M", days: 63 },
  { value: "6m", label: "6M", days: 130 },
] as const;

type Period = (typeof periods)[number]["value"];

const last = dailyCandles.at(-1)!;

export function CandlestickRangeCard() {
  const [period, setPeriod] = useState<Period>("3m");
  const days = periods.find((item) => item.value === period)!.days;
  const candles = dailyCandles.slice(-days);
  const first = candles[0]!;
  const change = ((last.close - first.open) / first.open) * 100;

  return (
    <ChartCard
      title="Daily close"
      description="Range tabs — switch the window; the dashed line is the latest close"
      value={formatPrice(last.close)}
      change={Math.round(change * 10) / 10}
      action={
        <ChartPeriodTabs
          value={period}
          options={periods}
          onValueChange={setPeriod}
        />
      }
      footer={`Change measured from the first open in the selected window (${days} trading days).`}
    >
      <ChartContainer config={candlestickConfig} className="h-64 w-full">
        <BarChart
          data={candles}
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
            domain={priceDomain(candles)}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatPriceTick}
            width={56}
          />
          <ReferenceLine
            y={last.close}
            stroke="var(--foreground)"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
            content={
              <CandlestickTooltip
                formatLabel={(time) => formatCandleDate(time, "long")}
              />
            }
          />
          {CandlestickBars({ maxBarSize: period === "6m" ? 6 : 10 })}
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
