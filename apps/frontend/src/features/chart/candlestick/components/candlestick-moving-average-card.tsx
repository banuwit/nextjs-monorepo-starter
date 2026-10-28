"use client";

import { CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { CandlestickBars } from "@/features/chart/candlestick/components/candlestick-bars";
import { CandlestickTooltip } from "@/features/chart/candlestick/components/candlestick-tooltip";
import {
  formatCandleDate,
  priceDomain,
  withMovingAverages,
} from "@/features/chart/candlestick/utils/candlestick";
import {
  candlestickConfig,
  formatPriceTick,
  movingAverageConfig,
} from "@/features/chart/candlestick/utils/candlestick-config";
import { dailyCandles } from "@/mocks/chart-candlestick.mock";

// Compute averages on the full series, then show the last quarter so the
// 20-day window is already filled at the left edge.
const rows = withMovingAverages(dailyCandles).slice(-65);
const last = rows.at(-1)!;

const config = { ...candlestickConfig, ...movingAverageConfig };

export function CandlestickMovingAverageCard() {
  const legend = useChartLegendToggle();
  const crossedAbove = last.sma7! > last.sma20!;

  return (
    <ChartCard
      title="Moving averages"
      description="Overlay — daily candles with 7- and 20-day simple moving averages"
      footer={
        crossedAbove
          ? "SMA 7 is above SMA 20: short-term momentum is positive."
          : "SMA 7 is below SMA 20: short-term momentum is negative."
      }
    >
      <ChartContainer config={config} className="h-64 w-full">
        <ComposedChart
          data={rows}
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
            domain={priceDomain(rows)}
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
          {CandlestickBars({ maxBarSize: 8 })}
          <Line
            dataKey="sma7"
            type="monotone"
            stroke="var(--color-sma7)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            hide={legend.isHidden("sma7")}
          />
          <Line
            dataKey="sma20"
            type="monotone"
            stroke="var(--color-sma20)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            hide={legend.isHidden("sma20")}
          />
        </ComposedChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(movingAverageConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
