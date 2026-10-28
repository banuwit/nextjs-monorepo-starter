// Presentational sample data for the brush & sync chart variants.
// Long series are generated from the index only (no Math.random/Date.now),
// so the server and client render the same values.

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const START = Date.UTC(2026, 0, 1);

const isoDay = (index: number) =>
  new Date(START + index * DAY_MS).toISOString().slice(0, 10);

const weekly = (index: number) => Math.sin((index / 7) * Math.PI * 2);

/** 180 days of sessions for the brush on area example. */
export const dailySessions = Array.from({ length: 180 }, (_, index) => ({
  date: isoDay(index),
  sessions: Math.round(
    1200 + index * 4 + weekly(index) * 180 + ((index * 37) % 90),
  ),
}));

/** 90 days of stock movements: received (positive) and shipped (negative). */
export const dailyStockMoves = Array.from({ length: 90 }, (_, index) => ({
  date: isoDay(index),
  received: Math.round(60 + weekly(index) * 20 + ((index * 29) % 40)),
  shipped: -Math.round(55 + weekly(index + 3) * 18 + ((index * 41) % 45)),
}));

/** 120 days of API latency percentiles, keyed by UTC timestamp. */
export const dailyLatency = Array.from({ length: 120 }, (_, index) => {
  const base = 120 + Math.sin(index / 9) * 25 + ((index * 17) % 20);
  const spike = index % 23 === 11 ? 140 : 0;
  return {
    ts: START + index * DAY_MS,
    p50: Math.round(base),
    p95: Math.round(base * 2.1 + spike + ((index * 13) % 35)),
  };
});

/** 48 hours of service metrics for the synchronized charts example. */
export const hourlyServiceMetrics = Array.from({ length: 48 }, (_, index) => {
  const daily = Math.sin(((index % 24) / 24) * Math.PI * 2 - Math.PI / 2);
  return {
    time: new Date(START + index * HOUR_MS).toISOString(),
    requests: Math.round(4200 + daily * 2600 + ((index * 53) % 400)),
    latency: Math.round(180 + daily * 60 + ((index * 31) % 45)),
    errors: Math.round(12 + Math.max(0, daily) * 18 + ((index * 7) % 9)),
  };
});

/** 42 days of visitors by platform. */
export const dailyPlatformVisitors = Array.from({ length: 42 }, (_, index) => ({
  date: isoDay(index),
  desktop: Math.round(
    320 + index * 3 + weekly(index) * 70 + ((index * 37) % 60),
  ),
  mobile: Math.round(
    240 + index * 2 + weekly(index) * 40 + ((index * 53) % 50),
  ),
}));

/** Orders on weekdays only, so the rows do not line up by index. */
export const weekdayOrders = dailyPlatformVisitors
  .filter((row) => {
    const day = new Date(row.date).getUTCDay();
    return day !== 0 && day !== 6;
  })
  .map((row, index) => ({
    date: row.date,
    orders: Math.round((row.desktop + row.mobile) * 0.06 + (index % 5) * 3),
  }));
