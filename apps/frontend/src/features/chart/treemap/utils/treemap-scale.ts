/** Teal shades from lightest (index 0) to darkest (index 4). */
export const chartShades = [
  "oklch(0.91 0.096 180.426)", // teal-200
  "oklch(0.855 0.138 181.071)", // teal-300
  "oklch(0.777 0.152 181.912)", // teal-400
  "oklch(0.6 0.118 184.704)", // teal-600
  "oklch(0.437 0.078 188.216)", // teal-800
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

/** Dark shades (teal-600, teal-800) need light text; lighter ones dark text. */
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
