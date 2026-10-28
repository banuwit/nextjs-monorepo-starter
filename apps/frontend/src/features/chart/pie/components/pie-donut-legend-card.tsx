"use client";

import { Label, Pie, PieChart } from "recharts";

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
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import { trafficSources } from "@/mocks/chart.mock";

const sourceConfig = {
  visitors: { label: "Visitors" },
  organic: { label: "Organic", color: "var(--chart-1)" },
  direct: { label: "Direct", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
  email: { label: "Email", color: "var(--chart-6)" },
} satisfies ChartConfig;

// Fill per slice comes from the config so colors stay stable when filtering.
const sourceData = trafficSources.map((item) => ({
  ...item,
  fill: `var(--color-${item.source})`,
}));

export function PieDonutLegendCard() {
  const legend = useChartLegendToggle();
  const visible = sourceData.filter((item) => !legend.isHidden(item.source));
  const total = sumBy(visible, (item) => item.visitors);

  return (
    <ChartCard
      title="Traffic sources"
      description="Donut with center total; click a source to hide or show it"
    >
      <div className="flex flex-col items-center gap-6 @md/main:flex-row">
        <ChartContainer
          config={sourceConfig}
          className="aspect-square h-56 shrink-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="source" hideLabel />}
            />
            <Pie
              data={visible}
              dataKey="visitors"
              nameKey="source"
              innerRadius={62}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-semibold"
                      >
                        {formatCompact(total)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 22}
                        className="fill-muted-foreground"
                      >
                        Visitors
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <ChartLegendToggle
          variant="list"
          className="w-full"
          isHidden={legend.isHidden}
          onToggle={legend.toggle}
          items={legendItemsFromConfig(sourceConfig).map((item) => {
            const row = trafficSources.find(
              (source) => source.source === item.key,
            );
            const visitors = row?.visitors ?? 0;
            return {
              ...item,
              value: visitors.toLocaleString("en-US"),
              share:
                legend.isHidden(item.key) || !total
                  ? 0
                  : (visitors / total) * 100,
            };
          })}
        />
      </div>
    </ChartCard>
  );
}
