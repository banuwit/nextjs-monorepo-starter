"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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
import { skillAssessment } from "@/mocks/chart.mock";

const skillConfig = {
  current: { label: "Current", color: "var(--chart-2)" },
  target: { label: "Target", color: "var(--foreground)" },
} satisfies ChartConfig;

export function RadarMultipleCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Team skills"
      description="Two series: current level vs target"
      footer="Security and DevOps have the largest gap to target."
    >
      <ChartContainer
        config={skillConfig}
        className="mx-auto aspect-auto h-72 w-full max-w-md"
      >
        <RadarChart data={skillAssessment} outerRadius="70%">
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="target"
            fill="none"
            stroke="var(--color-target)"
            strokeDasharray="4 4"
            strokeWidth={2}
            hide={legend.isHidden("target")}
          />
          <Radar
            dataKey="current"
            fill="var(--color-current)"
            fillOpacity={0.4}
            stroke="var(--color-current)"
            hide={legend.isHidden("current")}
          />
        </RadarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(skillConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
