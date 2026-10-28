import type { BrushRange } from "@/features/chart/brush-sync/types/brush-sync";

/** Shared `<Brush>` styling: theme tokens, so it follows light/dark mode. */
export const brushStyle = {
  height: 32,
  travellerWidth: 10,
  stroke: "var(--chart-3)",
  fill: "var(--card)",
} as const;

/** "2026-01-05" or a UTC timestamp → "Jan 5" (or "January 5"). */
export function formatDay(
  value: string | number,
  month: "short" | "long" = "short",
) {
  return new Date(value).toLocaleDateString("en-US", {
    month,
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Rows inside an inclusive brush window. */
export function sliceRange<T>(rows: readonly T[], range: BrushRange) {
  return rows.slice(range.startIndex, range.endIndex + 1);
}

/** Last `count` rows of a series as a brush window. */
export function lastRange(length: number, count: number): BrushRange {
  return { startIndex: Math.max(0, length - count), endIndex: length - 1 };
}

/**
 * Padded `[min, max]` Y domain for the given keys of the visible rows,
 * rounded out to a multiple of `step` so the ticks stay readable.
 */
export function valueDomain<T>(
  rows: readonly T[],
  keys: readonly (keyof T)[],
  step = 10,
  padding = 0.05,
): [number, number] {
  const values = rows.flatMap((row) => keys.map((key) => Number(row[key])));
  if (values.length === 0) return [0, 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min || max || 1) * padding;
  return [
    Math.max(0, Math.floor((min - pad) / step) * step),
    Math.ceil((max + pad) / step) * step,
  ];
}

/** ISO timestamp → "05:00", or "Jan 1, 05:00" with `withDay`. */
export function formatHour(value: string, withDay = false) {
  const hour = value.slice(11, 16);
  return withDay ? `${formatDay(value)}, ${hour}` : hour;
}
