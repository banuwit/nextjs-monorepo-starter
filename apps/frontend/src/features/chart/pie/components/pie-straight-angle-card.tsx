"use client";

import { Pie, PieChart } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency, sumBy } from "@/features/chart/utils/format";
import { departmentBudget } from "@/mocks/chart-pie.mock";

const budgetConfig = {
  budget: { label: "Budget" },
  engineering: { label: "Engineering", color: "var(--chart-1)" },
  marketing: { label: "Marketing", color: "var(--chart-2)" },
  sales: { label: "Sales", color: "var(--chart-3)" },
  operations: { label: "Operations", color: "var(--chart-4)" },
} satisfies ChartConfig;

const budgetData = departmentBudget.map((item) => ({
  ...item,
  fill: `var(--color-${item.department})`,
}));

export function PieStraightAngleCard() {
  const legend = useChartLegendToggle();
  const visible = budgetData.filter(
    (item) => !legend.isHidden(item.department),
  );
  const total = sumBy(visible, (item) => item.budget);

  return (
    <ChartCard
      title="Budget by department"
      description="Straight angle — a half pie from 180° to 0° with the total at the bottom"
      footer="Approved budget for this quarter."
    >
      <div className="relative mx-auto w-full max-w-sm">
        <ChartContainer config={budgetConfig} className="aspect-[2/1] w-full">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="department" hideLabel />}
            />
            <Pie
              data={visible}
              dataKey="budget"
              nameKey="department"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="110%"
              outerRadius="180%"
              stroke="var(--card)"
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>
        {/* HTML overlay keeps the total centered on the flat edge at any width. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-2xl font-semibold tabular-nums">
            {formatCurrency(total)}
          </span>
          <span className="text-sm text-muted-foreground">Total budget</span>
        </div>
      </div>
      <ChartLegendToggle
        items={legendItemsFromConfig(budgetConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
