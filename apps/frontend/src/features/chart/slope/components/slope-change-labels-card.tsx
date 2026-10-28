"use client";

import { ChartCard } from "@/components/chart-card";
import type { ChartConfig } from "@/components/ui/chart";
import { SlopeChart } from "@/features/chart/slope/components/slope-chart";
import { conversionByPlan } from "@/mocks/chart-slope.mock";

const planConfig = {
  free: { label: "Free", color: "var(--chart-10)" },
  starter: { label: "Starter", color: "var(--chart-2)" },
  pro: { label: "Pro", color: "var(--chart-1)" },
  team: { label: "Team", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function SlopeChangeLabelsCard() {
  return (
    <ChartCard
      title="Conversion by plan"
      description="Change labels — Δ% next to end values, drops in red"
      footer="Pro conversion fell after the pricing page redesign."
    >
      <SlopeChart
        data={conversionByPlan}
        config={planConfig}
        showChange
        formatValue={(value) => `${value.toFixed(1)}%`}
      />
    </ChartCard>
  );
}
