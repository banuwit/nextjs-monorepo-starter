"use client";

import { LabelList, Pie, PieChart } from "recharts";

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
import { browserShare } from "@/mocks/chart.mock";

const browserConfig = {
  share: { label: "Share" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  edge: { label: "Edge", color: "var(--chart-3)" },
  firefox: { label: "Firefox", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-10)" },
} satisfies ChartConfig;

const browserData = browserShare.map((item) => ({
  ...item,
  fill: `var(--color-${item.browser})`,
}));

export function PiePaddingAngleCard() {
  const legend = useChartLegendToggle();
  const visible = browserData.filter((item) => !legend.isHidden(item.browser));

  return (
    <ChartCard
      title="Browser share"
      description="Pie with padding angle, rounded corners, and labels"
      footer="Share of sessions in the last 30 days."
    >
      <ChartContainer
        config={browserConfig}
        className="mx-auto aspect-square h-64"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="browser" hideLabel />}
          />
          <Pie
            data={visible}
            dataKey="share"
            nameKey="browser"
            innerRadius={36}
            paddingAngle={3}
            cornerRadius={6}
          >
            <LabelList
              dataKey="share"
              stroke="none"
              fontSize={11}
              className="fill-neutral-950 font-medium"
              formatter={(value) => `${value}%`}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(browserConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
