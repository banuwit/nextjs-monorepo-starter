// Presentational OHLC sample data for the candlestick chart variants.
// Generated from a seeded PRNG so server and client produce identical rows.

import type { Candle } from "@/features/chart/candlestick/types/candlestick";

/** mulberry32: small deterministic PRNG. */
function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round2 = (value: number) => Math.round(value * 100) / 100;

type GenerateOptions = {
  seed: number;
  count: number;
  start: number;
  /** Max relative move per candle, e.g. 0.02 for 2%. */
  volatility: number;
  /** Drift per candle as a fraction, e.g. 0.001. */
  drift?: number;
  time: (index: number) => string;
  volume?: { base: number; spread: number };
};

function generateCandles({
  seed,
  count,
  start,
  volatility,
  drift = 0,
  time,
  volume,
}: GenerateOptions): Candle[] {
  const random = createRandom(seed);
  let previousClose = start;

  return Array.from({ length: count }, (_, index) => {
    const open = round2(
      previousClose * (1 + (random() - 0.5) * volatility * 0.4),
    );
    const move = (random() - 0.5) * 2 * volatility + drift;
    const close = round2(open * (1 + move));
    const upper = Math.max(open, close);
    const lower = Math.min(open, close);
    const high = round2(upper * (1 + random() * volatility * 0.6));
    const low = round2(lower * (1 - random() * volatility * 0.6));
    previousClose = close;

    const candle: Candle = { time: time(index), open, high, low, close };
    if (volume) {
      // Bigger moves trade more volume.
      const impact = 1 + Math.abs(move) / volatility;
      candle.volume = Math.round(
        (volume.base + random() * volume.spread) * impact,
      );
    }
    return candle;
  });
}

/** ISO date `days` trading days after 2026-01-05 (a Monday), skipping weekends. */
function tradingDay(index: number) {
  const weeks = Math.floor(index / 5);
  const date = new Date(Date.UTC(2026, 0, 5 + weeks * 7 + (index % 5)));
  return date.toISOString().slice(0, 10);
}

/** 5-minute candles for one regular session, 09:30–16:00 UTC. */
function sessionMinute(index: number) {
  return new Date(Date.UTC(2026, 2, 18, 9, 30 + index * 5)).toISOString();
}

/** Monday of each ISO week starting 2025-07-07. */
function weekStart(index: number) {
  return new Date(Date.UTC(2025, 6, 7 + index * 7)).toISOString().slice(0, 10);
}

/** One trading session of 5-minute candles (78 bars). */
export const intradayCandles = generateCandles({
  seed: 1337,
  count: 78,
  start: 186.4,
  volatility: 0.004,
  time: sessionMinute,
});

/** Six months of daily candles with volume (~130 trading days). */
export const dailyCandles = generateCandles({
  seed: 2024,
  count: 130,
  start: 142,
  volatility: 0.025,
  drift: 0.0012,
  time: tradingDay,
  volume: { base: 1_800_000, spread: 1_400_000 },
});

/** One year of weekly candles. */
export const weeklyCandles = generateCandles({
  seed: 7,
  count: 52,
  start: 58,
  volatility: 0.05,
  drift: 0.003,
  time: weekStart,
  volume: { base: 9_000_000, spread: 6_000_000 },
});
