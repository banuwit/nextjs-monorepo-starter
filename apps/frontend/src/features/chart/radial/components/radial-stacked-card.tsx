"use client";

import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

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
import { planSplit } from "@/mocks/chart-radial.mock";

const splitConfig = {
  monthly: { label: "Monthly plan", color: "var(--chart-2)" },
  annual: { label: "Annual plan", color: "var(--chart-4)" },
} satisfies ChartConfig;

/** Two values stacked on a half circle with the total in the middle. */
export function RadialStackedCard() {
  const legend = useChartLegendToggle();
  const [row] = planSplit;
  const total =
    (legend.isHidden("monthly") ? 0 : (row?.monthly ?? 0)) +
    (legend.isHidden("annual") ? 0 : (row?.annual ?? 0));

  return (
    <ChartCard
      title="Subscriptions"
      description="Stacked — two values on a half circle with a center total"
    >
      <ChartContainer
        config={splitConfig}
        className="mx-auto aspect-auto h-40 w-full max-w-72"
      >
        <RadialBarChart
          data={planSplit}
          cy="90%"
          endAngle={180}
          innerRadius={90}
          outerRadius={124}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <PolarAngleAxis
            type="number"
            domain={[0, total || 1]}
            tick={false}
            axisLine={false}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) - 26}
                      className="fill-foreground text-2xl font-semibold"
                    >
                      {total.toLocaleString("en-US")}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) - 6}
                      className="fill-muted-foreground"
                    >
                      Subscribers
                    </tspan>
                  </text>
                );
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="monthly"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-monthly)"
            className="stroke-transparent stroke-2"
            hide={legend.isHidden("monthly")}
          />
          <RadialBar
            dataKey="annual"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-annual)"
            className="stroke-transparent stroke-2"
            hide={legend.isHidden("annual")}
          />
        </RadialBarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(splitConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
