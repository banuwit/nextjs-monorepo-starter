"use client";

import { Bar, DefaultZIndexes, ErrorBar, type BarShapeProps } from "recharts";

import { CandlestickShape } from "@/features/chart/candlestick/components/candlestick-shape";
import {
  candleBody,
  candleWick,
} from "@/features/chart/candlestick/utils/candlestick";

/**
 * Body as a range `Bar` plus a capless `ErrorBar` for the wick, following
 * the Recharts candlestick example. Spread into any BarChart/ComposedChart.
 */
export function CandlestickBars({
  hollow = false,
  maxBarSize = 12,
}: {
  hollow?: boolean;
  maxBarSize?: number;
}) {
  return (
    <Bar
      dataKey={candleBody}
      name="Price"
      shape={(props: BarShapeProps) => (
        <CandlestickShape {...props} hollow={hollow} />
      )}
      maxBarSize={maxBarSize}
      isAnimationActive={false}
    >
      <ErrorBar
        dataKey={candleWick}
        width={0}
        strokeWidth={1}
        stroke="var(--muted-foreground)"
        zIndex={DefaultZIndexes.bar - 1}
        isAnimationActive={false}
      />
    </Bar>
  );
}
