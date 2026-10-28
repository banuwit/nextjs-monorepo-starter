import type {
  BoxPlotOutlierPoint,
  BoxPlotRow,
  BoxStats,
} from "@/features/chart/box-plot/types/box-plot";

/** Linear-interpolated quantile (same method as Excel QUARTILE.INC). */
export function quantile(sorted: readonly number[], q: number) {
  const position = (sorted.length - 1) * q;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  const weight = position - lower;
  return sorted[lower]! + (sorted[upper]! - sorted[lower]!) * weight;
}

const round1 = (value: number) => Math.round(value * 10) / 10;

/**
 * Five-number summary from raw samples. With `fences`, whiskers stop at the
 * last sample inside Q1 − 1.5·IQR / Q3 + 1.5·IQR (Tukey) and the rest are
 * returned as outliers; otherwise whiskers span the full min→max.
 */
export function computeBoxStats(
  samples: readonly number[],
  { fences = false }: { fences?: boolean } = {},
): BoxStats {
  const sorted = [...samples].sort((a, b) => a - b);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const low = fences ? q1 - 1.5 * iqr : -Infinity;
  const high = fences ? q3 + 1.5 * iqr : Infinity;
  const inside = sorted.filter((value) => value >= low && value <= high);
  const total = sorted.reduce((sum, value) => sum + value, 0);

  return {
    min: inside[0]!,
    q1: round1(q1),
    median: round1(quantile(sorted, 0.5)),
    q3: round1(q3),
    max: inside.at(-1)!,
    mean: round1(total / sorted.length),
    outliers: sorted.filter((value) => value < low || value > high),
  };
}

export const boxIqr = (stats: BoxStats) => round1(stats.q3 - stats.q1);

/** Bar `dataKey`: the whisker span min→max as a range bar. */
export const boxRange = (stats: BoxStats): [number, number] => [
  stats.min,
  stats.max,
];

/** One Scatter point per outlier, keyed by the row's category label. */
export const outlierPoints = (rows: readonly BoxPlotRow[]) =>
  rows.flatMap((row): BoxPlotOutlierPoint[] =>
    (row.box.outliers ?? []).map((value) => ({ label: row.label, value })),
  );

/**
 * Value-axis `domain` and round `ticks` covering every whisker and outlier,
 * e.g. 0–600 in steps of 150. Spread into `YAxis`/`XAxis`.
 */
export function boxAxis(boxes: readonly BoxStats[], tickCount = 5) {
  const values = boxes.flatMap((box) => [
    box.min,
    box.max,
    ...(box.outliers ?? []),
  ]);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const rough = (high - low) / (tickCount - 1) || 1;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step =
    [1, 2, 2.5, 5, 10].find((factor) => factor * magnitude >= rough)! *
    magnitude;
  const start = Math.max(0, Math.floor(low / step) * step);
  const count = Math.ceil((high - start) / step);
  const ticks = Array.from({ length: count + 1 }, (_, i) => start + i * step);

  return { domain: [start, ticks.at(-1)!] as [number, number], ticks };
}
