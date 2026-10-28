/** Percent change from `start` to `end`; 0 when `start` is 0. */
export function percentChange(start: number, end: number) {
  return start === 0 ? 0 : ((end - start) / Math.abs(start)) * 100;
}

/** Signed percent label, e.g. "+12.5%" or "−8.0%". */
export function formatPercentChange(change: number) {
  const sign = change > 0 ? "+" : change < 0 ? "−" : "";
  return `${sign}${Math.abs(change).toFixed(1)}%`;
}

/** Color for a series by direction: rising uses `up`, falling `down`. */
export function directionColor(
  start: number,
  end: number,
  up = "var(--chart-4)",
  down = "var(--destructive)",
) {
  return end >= start ? up : down;
}
