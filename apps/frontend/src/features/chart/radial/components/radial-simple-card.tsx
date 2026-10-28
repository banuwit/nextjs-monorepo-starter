"use client";

import { RadialBar, RadialBarChart } from "recharts";

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
import { sumBy } from "@/features/chart/utils/format";
import { channelVisitors } from "@/mocks/chart-radial.mock";

const channelConfig = {
  visitors: { label: "Visitors" },
  organic: { label: "Organic", color: "var(--chart-1)" },
  direct: { label: "Direct", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
  email: { label: "Email", color: "var(--chart-6)" },
} satisfies ChartConfig;

const channelData = channelVisitors.map((item) => ({
  ...item,
  fill: `var(--color-${item.channel})`,
}));

/** One radial bar per item; the largest value completes the circle. */
export function RadialSimpleCard() {
  const legend = useChartLegendToggle();
  const visible = channelData.filter((item) => !legend.isHidden(item.channel));

  return (
    <ChartCard
      title="Visitors by channel"
      description="Simple — one bar per item with a background track"
      value={sumBy(visible, (item) => item.visitors).toLocaleString("en-US")}
      change={5.2}
    >
      <ChartContainer
        config={channelConfig}
        className="mx-auto aspect-square h-60"
      >
        <RadialBarChart data={visible} innerRadius="25%" outerRadius="100%">
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="channel" hideLabel />}
          />
          <RadialBar dataKey="visitors" background />
        </RadialBarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(channelConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
