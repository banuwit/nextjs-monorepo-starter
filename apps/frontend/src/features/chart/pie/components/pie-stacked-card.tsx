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
import { regionRevenue } from "@/mocks/chart-pie.mock";

const revenueConfig = {
  thisYear: { label: "This year" },
  lastYear: { label: "Last year" },
  asia: { label: "Asia", color: "var(--chart-1)" },
  europe: { label: "Europe", color: "var(--chart-2)" },
  america: { label: "America", color: "var(--chart-3)" },
  oceania: { label: "Oceania", color: "var(--chart-4)" },
  africa: { label: "Africa", color: "var(--chart-5)" },
} satisfies ChartConfig;

const revenueData = regionRevenue.map((item) => ({
  ...item,
  fill: `var(--color-${item.region})`,
}));

/** Two concentric pies: last year inside, this year outside. */
export function PieStackedCard() {
  const legend = useChartLegendToggle();
  const visible = revenueData.filter((item) => !legend.isHidden(item.region));

  return (
    <ChartCard
      title="Revenue by region"
      description="Stacked — inner ring last year, outer ring this year"
      footer="Hover a ring to see which year it belongs to."
    >
      <ChartContainer
        config={revenueConfig}
        className="mx-auto aspect-square h-64"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                nameKey="region"
                indicator="line"
                labelFormatter={(_, payload) => {
                  const key = payload?.[0]?.dataKey;
                  return key === "thisYear" || key === "lastYear"
                    ? revenueConfig[key].label
                    : null;
                }}
              />
            }
          />
          <Pie
            data={visible}
            dataKey="lastYear"
            nameKey="region"
            outerRadius={60}
          />
          <Pie
            data={visible}
            dataKey="thisYear"
            nameKey="region"
            innerRadius={70}
            outerRadius={95}
          />
        </PieChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(revenueConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
