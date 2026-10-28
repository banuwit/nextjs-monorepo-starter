"use client";

import { ChartCard } from "@/components/chart/chart-card";
import { FlowChart } from "@/features/chart/sankey/components/sankey-flow-chart";
import { regionPlans } from "@/mocks/chart-sankey.mock";

export function SankeyCompactCard() {
  return (
    <ChartCard
      title="Plans by region"
      description="Compact — names only, thin nodes, short height"
      footer="Values live in the tooltip to keep the chart small."
    >
      <FlowChart
        data={regionPlans}
        showValues={false}
        className="h-48 min-w-[24rem]"
        sankeyProps={{
          nodeWidth: 6,
          nodePadding: 12,
          margin: { top: 4, right: 88, bottom: 4, left: 4 },
        }}
      />
    </ChartCard>
  );
}
