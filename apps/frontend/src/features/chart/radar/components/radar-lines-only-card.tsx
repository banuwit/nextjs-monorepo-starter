"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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
import { channelEngagement } from "@/mocks/chart-radar.mock";

const engagementConfig = {
  organic: { label: "Organic", color: "var(--chart-1)" },
  paid: { label: "Paid", color: "var(--chart-4)" },
} satisfies ChartConfig;

/** Two series drawn as outlines only, on a grid without radial lines. */
export function RadarLinesOnlyCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Channel engagement"
      description="Lines only — outlined series without fill or radial lines"
    >
      <ChartContainer
        config={engagementConfig}
        className="mx-auto aspect-auto h-64 w-full max-w-md"
      >
        <RadarChart data={channelEngagement} outerRadius="70%">
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <PolarGrid radialLines={false} />
          <PolarAngleAxis dataKey="channel" tick={{ fontSize: 11 }} />
          <Radar
            dataKey="organic"
            fill="none"
            stroke="var(--color-organic)"
            strokeWidth={2}
            hide={legend.isHidden("organic")}
          />
          <Radar
            dataKey="paid"
            fill="none"
            stroke="var(--color-paid)"
            strokeWidth={2}
            hide={legend.isHidden("paid")}
          />
        </RadarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(engagementConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
