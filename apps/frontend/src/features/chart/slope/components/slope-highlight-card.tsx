"use client";

import { ChartCard } from "@/components/chart-card";
import type { ChartConfig } from "@/components/ui/chart";
import { SlopeChart } from "@/features/chart/slope/components/slope-chart";
import { npsByRegion } from "@/mocks/chart-slope.mock";

const regionConfig = {
  emea: { label: "EMEA", color: "var(--chart-4)" },
  na: { label: "N. America", color: "var(--chart-1)" },
  apac: { label: "APAC", color: "var(--chart-2)" },
  latam: { label: "LATAM", color: "var(--chart-3)" },
  mea: { label: "MEA", color: "var(--chart-6)" },
} satisfies ChartConfig;

export function SlopeHighlightCard() {
  return (
    <ChartCard
      title="NPS by region"
      description="Highlight — focus one line, mute the rest"
      value="+18 pts"
      change={45}
      footer="EMEA is the only region with a large gain."
    >
      <SlopeChart
        data={npsByRegion}
        config={regionConfig}
        highlight="emea"
        formatValue={(value) => `${value}`}
      />
    </ChartCard>
  );
}
