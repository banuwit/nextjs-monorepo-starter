import { type ChartConfig } from "@/components/ui/chart";
import type { WaterfallCategory } from "@/features/chart/waterfall/types/waterfall";

export const waterfallConfig = {
  increase: { label: "Increase", color: "var(--chart-1)" },
  decrease: { label: "Decrease", color: "var(--destructive)" },
  total: { label: "Total", color: "var(--chart-2)" },
} satisfies ChartConfig;

export const waterfallCategories = Object.keys(
  waterfallConfig,
) as WaterfallCategory[];

export const formatThousands = (value: number) => `$${value}K`;

export const formatNumber = (value: number) => value.toLocaleString("en-US");
