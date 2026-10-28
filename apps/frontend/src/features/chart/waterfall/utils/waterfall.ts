import type {
  WaterfallRow,
  WaterfallStep,
} from "@/features/chart/waterfall/types/waterfall";

/**
 * Turns signed steps into stacked-bar rows: an invisible `base` plus one
 * visible value in `increase`, `decrease`, or `total`. Assumes the running
 * total stays positive.
 */
export function computeWaterfall(steps: readonly WaterfallStep[]) {
  let running = 0;

  return steps.map<WaterfallRow>((step) => {
    if (step.kind === "total" || step.kind === "start") {
      if (step.kind === "start") running = step.amount;
      return {
        label: step.label,
        category: "total",
        amount: running,
        end: running,
        base: 0,
        total: running,
      };
    }

    const start = running;
    running += step.amount;
    const increase = step.amount >= 0;

    return {
      label: step.label,
      category: increase ? "increase" : "decrease",
      amount: step.amount,
      end: running,
      base: Math.min(start, running),
      [increase ? "increase" : "decrease"]: Math.abs(step.amount),
    };
  });
}

/** Horizontal connector segments from each bar's end to the next bar. */
export function waterfallConnectors(rows: readonly WaterfallRow[]) {
  return rows.slice(0, -1).map((row, index) => ({
    from: row.label,
    to: rows[index + 1]!.label,
    value: row.end,
  }));
}

export function formatSigned(value: number, format: (n: number) => string) {
  if (value === 0) return format(0);
  return `${value > 0 ? "+" : "−"}${format(Math.abs(value))}`;
}
