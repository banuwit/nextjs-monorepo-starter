// Lighter chart shades keep the dark tile labels readable.
const tileColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

export function tileColor(index: number) {
  return tileColors[index % tileColors.length] ?? "";
}
