import type { ChartConfig } from "@/components/ui/chart";

/** Colors shared by the mini sparkline components. */
export const miniSparklineConfig = {
  value: { label: "Value", color: "var(--chart-3)" },
  latest: { label: "Latest", color: "var(--chart-5)" },
  negative: { label: "Negative", color: "var(--destructive)" },
} satisfies ChartConfig;

/** Turns a list of numbers into `{ index, value }` rows for Recharts. */
export function toSeries(points: readonly number[]) {
  return points.map((value, index) => ({ index, value }));
}
