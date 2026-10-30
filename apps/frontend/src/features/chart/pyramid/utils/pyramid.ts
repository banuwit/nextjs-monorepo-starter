import { formatCompact } from "./format";
import type { PyramidRow } from "@/features/chart/pyramid/types/pyramid";

/**
 * Negates the left-side series so they grow left from the center axis.
 * Use with `stackOffset="sign"` on the chart.
 */
export function mirrorRows<T extends PyramidRow>(
  rows: readonly T[],
  leftKeys: readonly string[],
): T[] {
  return rows.map((row) => {
    const next: PyramidRow = { ...row };
    for (const key of leftKeys) next[key] = -Math.abs(Number(row[key]));
    return next as T;
  });
}

/** Turns each series into a percent share of its own column total. */
export function toSideShare<T extends PyramidRow>(
  rows: readonly T[],
  keys: readonly string[],
): T[] {
  const totals = Object.fromEntries(
    keys.map((key) => [
      key,
      rows.reduce((total, row) => total + Number(row[key]), 0),
    ]),
  );
  return rows.map((row) => {
    const next: PyramidRow = { ...row };
    for (const key of keys) {
      next[key] = Math.round((Number(row[key]) / totals[key]!) * 1000) / 10;
    }
    return next as T;
  });
}

/** Smallest 1/2/2.5/5 × 10^n step that is at least `value`. */
function niceStep(value: number) {
  const power = 10 ** Math.floor(Math.log10(value));
  return [1, 2, 2.5, 5, 10].find((m) => m * power >= value)! * power;
}

/**
 * Symmetric `[-limit, limit]` domain with even ticks around 0, so the center
 * axis stays in the middle. Sums the keys of each side, so it also fits
 * stacked pyramids.
 */
export function symmetricScale(
  rows: readonly PyramidRow[],
  sides: readonly (readonly string[])[],
  padding = 1.1,
) {
  const max =
    padding *
    Math.max(
      ...rows.flatMap((row) =>
        sides.map((keys) =>
          keys.reduce((total, key) => total + Math.abs(Number(row[key])), 0),
        ),
      ),
    );
  // About three ticks per side.
  const step = niceStep(max / 3);
  const count = Math.ceil(max / step);
  const limit = count * step;
  const ticks = Array.from(
    { length: count * 2 + 1 },
    (_, index) => (index - count) * step,
  );
  return { domain: [-limit, limit] as [number, number], ticks };
}

/** Tick/tooltip formatter that drops the sign: -1200 → "1.2K". */
export function formatAbs(
  value: number,
  format: (value: number) => string = formatCompact,
) {
  return format(Math.abs(value));
}

export const formatPercent = (value: number) => `${value}%`;
