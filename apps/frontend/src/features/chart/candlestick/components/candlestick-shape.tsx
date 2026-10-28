"use client";

import { Rectangle, type BarShapeProps } from "recharts";

import type { Candle } from "@/features/chart/candlestick/types/candlestick";
import {
  candleColor,
  candleDirection,
} from "@/features/chart/candlestick/utils/candlestick";

type CandlestickShapeProps = BarShapeProps & {
  /** Hollow bodies for up candles, filled for down (classic trading style). */
  hollow?: boolean;
};

/**
 * Custom `Bar` shape: colors the open→close body by direction. A doji
 * (open === close) would have zero height, so it is drawn as a 1px line.
 */
export function CandlestickShape({
  hollow = false,
  ...props
}: CandlestickShapeProps) {
  const candle = props.payload as Candle | undefined;
  if (!candle) return null;

  const color = candleColor(candle);
  const height = Math.max(props.height, 1);
  const y = props.height < 1 ? props.y - 0.5 : props.y;
  const isUp = candleDirection(candle) === "up";

  return (
    <Rectangle
      x={props.x}
      y={y}
      width={props.width}
      height={height}
      radius={1}
      fill={hollow && isUp ? "var(--background)" : color}
      stroke={color}
      strokeWidth={hollow ? 1.5 : 0}
    />
  );
}
