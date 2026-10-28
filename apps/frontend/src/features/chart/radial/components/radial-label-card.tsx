"use client";

import {
  Label,
  LabelList,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

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
import { sprintProgress } from "@/mocks/chart-radial.mock";

const sprintConfig = {
  done: { label: "Done" },
  web: { label: "Web", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
  platform: { label: "Platform", color: "var(--chart-3)" },
} satisfies ChartConfig;

const sprintData = sprintProgress.map((item) => ({
  ...item,
  fill: `var(--color-${item.team})`,
}));

/** Bars on a fixed 0–100 scale with the item name drawn inside each bar. */
export function RadialLabelCard() {
  const legend = useChartLegendToggle();
  const visible = sprintData.filter((item) => !legend.isHidden(item.team));

  return (
    <ChartCard
      title="Sprint progress"
      description="Label — item names drawn inside each bar"
      footer="Share of sprint scope completed per team."
    >
      <ChartContainer
        config={sprintConfig}
        className="mx-auto aspect-square h-60"
      >
        <RadialBarChart
          data={visible}
          startAngle={90}
          endAngle={-270}
          innerRadius="30%"
          outerRadius="100%"
          barSize={22}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                nameKey="team"
                hideLabel
                formatter={(value, _name, item) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {item.payload?.label}
                    </span>
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {value}%
                    </span>
                  </div>
                )}
              />
            }
          />
          <RadialBar dataKey="done" background cornerRadius={11}>
            <LabelList
              dataKey="label"
              position="insideStart"
              stroke="none"
              fontSize={11}
              className="fill-neutral-950 font-medium"
            />
          </RadialBar>
        </RadialBarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(sprintConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
