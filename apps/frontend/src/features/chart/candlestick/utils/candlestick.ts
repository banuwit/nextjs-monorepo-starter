import type {
  Candle,
  CandleDirection,
  CandleRow,
} from "@/features/chart/candlestick/types/candlestick";
import { candlestickConfig } from "@/features/chart/candlestick/utils/candlestick-config";

export const candleDirection = (candle: Candle): CandleDirection =>
  candle.close >= candle.open ? "up" : "down";

export const candleColor = (candle: Candle) =>
  candlestickConfig[candleDirection(candle)].color;

/** Bar `dataKey`: the body spans open→close as a range bar. */
export const candleBody = (candle: Candle): [number, number] => [
  Math.min(candle.open, candle.close),
  Math.max(candle.open, candle.close),
];

/**
 * ErrorBar `dataKey`: distances from the top of the body down to `low` and
 * up to `high`, so a single ErrorBar draws both wicks.
 */
export const candleWick = (candle: Candle): [number, number] => {
  const top = Math.max(candle.open, candle.close);
  return [top - candle.low, candle.high - top];
};

/** Signed close-to-close change in percent against the previous candle. */
export const candleChange = (candle: Candle, previous?: Candle) => {
  const base = previous?.close ?? candle.open;
  return ((candle.close - base) / base) * 100;
};

/** Simple moving average of `close`; undefined until the window fills. */
export function withMovingAverages(
  candles: readonly Candle[],
  windows: { sma7?: number; sma20?: number } = { sma7: 7, sma20: 20 },
): CandleRow[] {
  const average = (end: number, size: number) => {
    const slice = candles.slice(end - size + 1, end + 1);
    const total = slice.reduce((sum, candle) => sum + candle.close, 0);
    return Math.round((total / size) * 100) / 100;
  };

  return candles.map((candle, index) => {
    const row: CandleRow = { ...candle };
    if (windows.sma7 && index >= windows.sma7 - 1) {
      row.sma7 = average(index, windows.sma7);
    }
    if (windows.sma20 && index >= windows.sma20 - 1) {
      row.sma20 = average(index, windows.sma20);
    }
    return row;
  });
}

/** Y-axis domain padded by a fraction of the full high–low range. */
export function priceDomain(
  candles: readonly Candle[],
  padding = 0.08,
): [number, number] {
  const low = Math.min(...candles.map((candle) => candle.low));
  const high = Math.max(...candles.map((candle) => candle.high));
  const pad = (high - low) * padding;
  return [Math.floor(low - pad), Math.ceil(high + pad)];
}

export function formatCandleDate(
  value: string,
  style: "short" | "long" = "short",
) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: style === "long" ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

export function formatCandleTime(value: string) {
  const date = new Date(value);
  return `${date.getUTCHours()}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
}

export function formatVolume(value: number) {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${Math.round(value / 1e3)}K`;
  return `${value}`;
}
