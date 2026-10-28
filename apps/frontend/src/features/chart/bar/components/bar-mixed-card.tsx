"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

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
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import { browserVisitors } from "@/mocks/chart-bar.mock";

const browserConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
  edge: { label: "Edge", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-10)" },
} satisfies ChartConfig;

type Browser = Exclude<keyof typeof browserConfig, "visitors">;

const browserData = browserVisitors.map((row) => ({
  ...row,
  fill: `var(--color-${row.browser})`,
}));

const browserKeys = browserVisitors.map((row) => row.browser);

export function BarMixedCard() {
  const legend = useChartLegendToggle();
  const visible = browserData.filter((row) => !legend.isHidden(row.browser));

  return (
    <ChartCard
      title="Visitors by browser"
      description="Mixed — per-bar colors from ChartConfig, tooltip without label"
      value={formatCompact(sumBy(visible, (row) => row.visitors))}
    >
      <ChartContainer config={browserConfig} className="h-64 w-full">
        <BarChart
          data={visible}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="browser"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: string) =>
              browserConfig[value as Browser]?.label ?? value
            }
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="browser" />}
          />
          <Bar dataKey="visitors" radius={6}>
            {visible.map((row) => (
              <Cell key={row.browser} fill={row.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(browserConfig, browserKeys)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
