/** Chart shades from lightest (index 0) to darkest (index 4). */
export const chartShades = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

/**
 * Maps a value to a shade index between 0 and `steps - 1`, linearly between
 * `min` and `max`. Larger values get darker shades.
 */
export function shadeIndex(
  value: number,
  min: number,
  max: number,
  steps = chartShades.length,
) {
  if (max <= min) return steps - 1;
  const ratio = (value - min) / (max - min);
  return Math.min(steps - 1, Math.floor(ratio * steps));
}

/** Dark shades (chart-4, chart-5) need light text; lighter ones dark text. */
export function isDarkShade(index: number) {
  return index >= 3;
}

/** Adds each item's percent share of the total as `share`. */
export function withShare<T extends { size: number }>(items: readonly T[]) {
  const total = items.reduce((sum, item) => sum + item.size, 0);
  return items.map((item) => ({
    ...item,
    share: total ? (item.size / total) * 100 : 0,
  }));
}
