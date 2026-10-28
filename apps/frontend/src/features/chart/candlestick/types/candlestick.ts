/** One OHLC candle. `time` is an ISO date (daily/weekly) or a timestamp (intraday). */
export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  /** Traded units; omitted for intraday samples. */
  volume?: number;
};

export type CandleDirection = "up" | "down";

/** Candle plus optional derived series (moving averages). */
export type CandleRow = Candle & {
  sma7?: number;
  sma20?: number;
};
