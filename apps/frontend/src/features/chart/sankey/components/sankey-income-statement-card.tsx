"use client";

import { ChartCard } from "@/components/chart/chart-card";
import { FlowChart } from "@/features/chart/sankey/components/sankey-flow-chart";
import { incomeStatement } from "@/mocks/chart.mock";

export function SankeyIncomeStatementCard() {
  return (
    <ChartCard
      title="Income statement"
      description="Revenue sources flowing to profit and costs ($K)"
      value="$1.1M"
      change={14.2}
      footer="Toggle a revenue source to see how the flows change."
    >
      <FlowChart data={incomeStatement} />
    </ChartCard>
  );
}
