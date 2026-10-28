"use client";

import { ChartCard } from "@/components/chart/chart-card";
import { FlowChart } from "@/features/chart/sankey/components/sankey-flow-chart";
import { ticketRouting } from "@/mocks/chart-sankey.mock";

export function SankeyFixedOrderCard() {
  return (
    <ChartCard
      title="Ticket routing"
      description="Fixed order — sort={false} keeps nodes in data order"
      value="1,020 tickets"
      change={-4.2}
      footer="Channels and outcomes stay in priority order instead of by size."
    >
      <FlowChart
        data={ticketRouting}
        className="min-w-[30rem]"
        sankeyProps={{ sort: false }}
      />
    </ChartCard>
  );
}
