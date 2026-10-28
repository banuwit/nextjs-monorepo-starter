"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { errorBudgets } from "@/mocks/chart.mock";

const budgetColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-4)"];

const budgetConfig = {
  remaining: { label: "Remaining" },
  ...Object.fromEntries(
    errorBudgets.map((item, index) => [
      item.service,
      { label: item.label, color: budgetColors[index] },
    ]),
  ),
} satisfies ChartConfig;

const budgetData = errorBudgets.map((item, index) => ({
  ...item,
  fill: budgetColors[index],
}));

export function RadialRingsCard() {
  const legend = useChartLegendToggle();
  const visible = budgetData.filter((item) => !legend.isHidden(item.service));

  return (
    <ChartCard
      title="Error budget"
      description="Concentric rings, one per service; toggle in the legend"
    >
      <div className="flex flex-col items-center gap-6 @md/main:flex-row">
        <ChartContainer
          config={budgetConfig}
          className="aspect-square h-56 shrink-0"
        >
          <RadialBarChart
            data={visible}
            innerRadius="30%"
            outerRadius="100%"
            barSize={14}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="service" hideLabel />}
            />
            <RadialBar dataKey="remaining" background cornerRadius={8} />
          </RadialBarChart>
        </ChartContainer>
        <ChartLegendToggle
          variant="list"
          className="w-full"
          isHidden={legend.isHidden}
          onToggle={legend.toggle}
          items={budgetData.map((item) => ({
            key: item.service,
            label: item.label,
            value: `${item.remaining}%`,
            color: item.fill ?? "",
          }))}
        />
      </div>
    </ChartCard>
  );
}
