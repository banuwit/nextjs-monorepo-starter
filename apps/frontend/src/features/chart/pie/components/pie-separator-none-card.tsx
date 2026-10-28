"use client";

import { Pie, PieChart } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sumBy } from "@/features/chart/utils/format";
import { ticketCategories } from "@/mocks/chart-pie.mock";

const ticketConfig = {
  tickets: { label: "Tickets" },
  billing: { label: "Billing", color: "var(--chart-1)" },
  account: { label: "Account", color: "var(--chart-2)" },
  bug: { label: "Bug report", color: "var(--chart-3)" },
  feature: { label: "Feature request", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-10)" },
} satisfies ChartConfig;

const ticketData = ticketCategories.map((item) => ({
  ...item,
  fill: `var(--color-${item.category})`,
}));

/** Pie without the stroke between slices. */
export function PieSeparatorNoneCard() {
  const legend = useChartLegendToggle();
  const visible = ticketData.filter((item) => !legend.isHidden(item.category));

  return (
    <ChartCard
      title="Support tickets"
      description="Separator none — slices without stroke between them"
      value={sumBy(visible, (item) => item.tickets).toLocaleString("en-US")}
      change={-4.2}
    >
      <ChartContainer
        config={ticketConfig}
        className="mx-auto aspect-square h-60"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                nameKey="category"
                indicator="line"
                hideLabel
              />
            }
          />
          <Pie data={visible} dataKey="tickets" nameKey="category" stroke="0" />
        </PieChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(ticketConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
