"use client";

import { ChartCard } from "@/components/chart/chart-card";
import { FlowChart } from "@/features/chart/sankey/components/sankey-flow-chart";
import { signupFunnel } from "@/mocks/chart.mock";

export function SankeyTrialJourneyCard() {
  return (
    <ChartCard
      title="Trial journey"
      description="Signup source → trial → outcome"
      value="1,260 trials"
      change={-2.6}
      footer="43% of trials converted to a paid plan."
    >
      <FlowChart data={signupFunnel} />
    </ChartCard>
  );
}
