"use client";

import { ChartCard } from "@/components/chart-card";
import type { ChartConfig } from "@/components/ui/chart";
import { SlopeChart } from "@/features/chart/slope/components/slope-chart";
import { serviceRanking } from "@/mocks/chart.mock";

const rankingConfig = {
  search: { label: "Search", color: "var(--chart-1)" },
  checkout: { label: "Checkout", color: "var(--chart-2)" },
  catalog: { label: "Catalog", color: "var(--chart-4)" },
  profile: { label: "Profile", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function SlopeServiceRankCard() {
  return (
    <ChartCard
      title="Service rank"
      description="Rank by request volume, Q1 → Q2 (1 = highest)"
      footer="Checkout overtook search as the busiest service."
    >
      <SlopeChart
        data={serviceRanking}
        config={rankingConfig}
        reversed
        formatValue={(value) => `#${value}`}
      />
    </ChartCard>
  );
}
