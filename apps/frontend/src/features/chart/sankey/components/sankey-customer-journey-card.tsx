"use client";

import { ChartCard } from "@/components/chart/chart-card";
import { SankeyFlowChart } from "@/features/chart/sankey/components/sankey-flow-chart";
import { customerJourney } from "@/mocks/chart-sankey.mock";

export function SankeyCustomerJourneyCard() {
  return (
    <ChartCard
      title="Customer journey"
      description="Multi-level — five stages, drop-offs stay in their stage"
      value="260 purchases"
      change={3.1}
      footer='align="left" keeps exits next to the stage where users left; values are in the tooltip.'
    >
      <SankeyFlowChart
        data={customerJourney}
        showValues={false}
        className="min-w-[30rem]"
        sankeyProps={{
          align: "left",
          nodePadding: 18,
          margin: { top: 8, right: 80, bottom: 8, left: 8 },
        }}
      />
    </ChartCard>
  );
}
