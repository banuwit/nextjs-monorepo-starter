/** One input step of a waterfall/bridge chart. */
export type WaterfallStep =
  | { label: string; kind: "start" | "delta"; amount: number }
  | { label: string; kind: "total" };

export type WaterfallCategory = "increase" | "decrease" | "total";

/** A computed row ready for a stacked Recharts bar (invisible `base`). */
export type WaterfallRow = {
  label: string;
  category: WaterfallCategory;
  /** Signed change, or the running total for total bars. */
  amount: number;
  /** Running total after this step. */
  end: number;
  /** Invisible offset bar under the visible value. */
  base: number;
  increase?: number;
  decrease?: number;
  total?: number;
};
