"use client";

import { ChartExamplePage } from "@/features/chart/components/chart-example-page";
import { SankeyIncomeStatementCard } from "@/features/chart/sankey/components/sankey-income-statement-card";
import { SankeyTrialJourneyCard } from "@/features/chart/sankey/components/sankey-trial-journey-card";
import { SankeyLeadSourceCard } from "@/features/chart/sankey/components/sankey-lead-source-card";
import { SankeyCustomerJourneyCard } from "@/features/chart/sankey/components/sankey-customer-journey-card";
import { SankeyBudgetHoverCard } from "@/features/chart/sankey/components/sankey-budget-hover-card";
import { SankeyFixedOrderCard } from "@/features/chart/sankey/components/sankey-fixed-order-card";
import { SankeyCompactCard } from "@/features/chart/sankey/components/sankey-compact-card";

export function SankeyChartPage() {
  return (
    <ChartExamplePage title="Sankey">
      <SankeyIncomeStatementCard />
      <SankeyTrialJourneyCard />
      <SankeyLeadSourceCard />
      <SankeyCustomerJourneyCard />
      <SankeyBudgetHoverCard />
      <SankeyFixedOrderCard />
      <SankeyCompactCard />
    </ChartExamplePage>
  );
}
