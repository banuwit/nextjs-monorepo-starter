const nodeColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

export function nodeColor(index: number) {
  return nodeColors[index % nodeColors.length] ?? "";
}

/** Stable color index set by filterSankeySources; falls back to `index`. */
export function getColorIndex(payload: unknown, index: number) {
  const { colorIndex } = payload as { colorIndex?: number };
  return colorIndex ?? index;
}
