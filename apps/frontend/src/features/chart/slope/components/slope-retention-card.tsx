"use client";

import { ChartCard } from "@/components/chart-card";
import type { ChartConfig } from "@/components/ui/chart";
import { SlopeChart } from "@/features/chart/slope/components/slope-chart";
import { channelRetention } from "@/mocks/chart.mock";

const retentionConfig = {
  referral: { label: "Referral", color: "var(--chart-1)" },
  organic: { label: "Organic", color: "var(--chart-2)" },
  paid: { label: "Paid", color: "var(--chart-4)" },
  social: { label: "Social", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function SlopeRetentionCard() {
  return (
    <ChartCard
      title="Retention by channel"
      description="Share of users still active, month 1 → month 6"
      footer="Paid and social lose the most users over time."
    >
      <SlopeChart
        data={channelRetention}
        config={retentionConfig}
        formatValue={(value) => `${value}%`}
      />
    </ChartCard>
  );
}
