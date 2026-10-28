import { type ChartConfig } from "@/components/ui/chart";

/** Up/down colors match the waterfall increase/decrease pair for consistency. */
export const candlestickConfig = {
  up: { label: "Up", color: "var(--chart-1)" },
  down: { label: "Down", color: "var(--destructive)" },
} satisfies ChartConfig;

export const movingAverageConfig = {
  sma7: { label: "SMA 7", color: "var(--chart-3)" },
  sma20: { label: "SMA 20", color: "var(--chart-4)" },
} satisfies ChartConfig;

export const formatPrice = (value: number) =>
  `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatPriceTick = (value: number) => `$${Math.round(value)}`;
