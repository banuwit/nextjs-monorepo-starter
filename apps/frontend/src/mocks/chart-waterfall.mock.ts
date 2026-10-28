// Presentational sample data for the waterfall chart variants.
// `start` opens the bridge, `delta` is a signed change, and `total` is a
// subtotal computed from the running sum (no amount needed).

import type { WaterfallStep } from "@/features/chart/waterfall/types/waterfall";

export const profitAndLoss: WaterfallStep[] = [
  { label: "Revenue", kind: "start", amount: 420 },
  { label: "COGS", kind: "delta", amount: -158 },
  { label: "Gross", kind: "total" },
  { label: "OpEx", kind: "delta", amount: -96 },
  { label: "Other", kind: "delta", amount: 22 },
  { label: "Tax", kind: "delta", amount: -38 },
  { label: "Net", kind: "total" },
];

export const arrBridge: WaterfallStep[] = [
  { label: "Q2 ARR", kind: "start", amount: 2400 },
  { label: "New", kind: "delta", amount: 520 },
  { label: "Expansion", kind: "delta", amount: 310 },
  { label: "Contraction", kind: "delta", amount: -140 },
  { label: "Churn", kind: "delta", amount: -230 },
  { label: "Q3 ARR", kind: "total" },
];

export const headcountBridge: WaterfallStep[] = [
  { label: "Start of year", kind: "start", amount: 48 },
  { label: "New hires", kind: "delta", amount: 14 },
  { label: "Transfers in", kind: "delta", amount: 3 },
  { label: "Attrition", kind: "delta", amount: -6 },
  { label: "Transfers out", kind: "delta", amount: -2 },
  { label: "Today", kind: "total" },
];

export const cashBalance: WaterfallStep[] = [
  { label: "Opening", kind: "start", amount: 120 },
  { label: "Jan", kind: "delta", amount: 18 },
  { label: "Feb", kind: "delta", amount: -12 },
  { label: "Mar", kind: "delta", amount: 25 },
  { label: "Apr", kind: "delta", amount: -9 },
  { label: "May", kind: "delta", amount: 14 },
  { label: "Jun", kind: "delta", amount: -21 },
  { label: "Closing", kind: "total" },
];
