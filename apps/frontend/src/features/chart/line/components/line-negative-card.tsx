"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
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
import { sumBy } from "@/features/chart/utils/format";
import { productGrowth } from "@/mocks/chart-line.mock";

const growthConfig = {
  core: { label: "Core", color: "var(--chart-2)" },
  addons: { label: "Add-ons", color: "var(--chart-4)" },
} satisfies ChartConfig;

type GrowthKey = keyof typeof growthConfig;

const growthKeys = Object.keys(growthConfig) as GrowthKey[];

const averages: Record<GrowthKey, number> = {
  core: sumBy(productGrowth, (row) => row.core) / productGrowth.length,
  addons: sumBy(productGrowth, (row) => row.addons) / productGrowth.length,
};

const formatPercent = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export function LineNegativeCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Monthly growth"
      description="Negative values — a y=0 reference line plus a dashed average line per series"
      value={formatPercent(averages.core)}
      change={averages.core}
      footer="ReferenceLine marks 0; the dashed lines are each product's average growth."
    >
      <ChartContainer config={growthConfig} className="h-64 w-full">
        <LineChart
          data={productGrowth}
          accessibilityLayer
          margin={{ left: -16, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `${value}%`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <ReferenceLine y={0} stroke="var(--foreground)" strokeOpacity={0.6} />
          {growthKeys.map((key) =>
            legend.isHidden(key) ? null : (
              <ReferenceLine
                key={`avg-${key}`}
                y={averages[key]}
                stroke={`var(--color-${key})`}
                strokeDasharray="4 4"
              />
            ),
          )}
          {growthKeys.map((key) => (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              dot={{ r: 3, fill: `var(--color-${key})` }}
              hide={legend.isHidden(key)}
            />
          ))}
        </LineChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(growthConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
