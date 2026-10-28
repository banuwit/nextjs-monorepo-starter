import { Pie } from "recharts";

// Shared half-circle geometry (pixels) for the Pie-based gauges.
export const ARC = {
  startAngle: 180,
  endAngle: 0,
  cy: 150,
  inner: 86,
  outer: 122,
};

export const bandColors = [
  "var(--destructive)",
  "var(--chart-3)",
  "var(--chart-1)",
];

export function bandOf<T extends { from: number; to: number }>(
  bands: readonly T[],
  value: number,
) {
  return (
    bands.find((band) => value >= band.from && value < band.to) ?? bands.at(-1)!
  );
}
