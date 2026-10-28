"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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
import { productQuality } from "@/mocks/chart.mock";

const qualityConfig = {
  score: { label: "This release", color: "var(--chart-2)" },
  previous: { label: "Previous release", color: "var(--chart-10)" },
} satisfies ChartConfig;

export function RadarGridCircleDotsCard() {
  const legend = useChartLegendToggle();
  const average =
    sumBy(productQuality, (row) => row.score) / productQuality.length;

  return (
    <ChartCard
      title="Quality score"
      description="Circular grid with dots and a fixed 0–100 domain"
      value={average.toFixed(0)}
      change={3.4}
    >
      <ChartContainer
        config={qualityConfig}
        className="mx-auto aspect-auto h-64 w-full max-w-md"
      >
        <RadarChart data={productQuality} outerRadius="70%">
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <PolarGrid gridType="circle" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="previous"
            fill="var(--color-previous)"
            fillOpacity={0.2}
            stroke="var(--color-previous)"
            hide={legend.isHidden("previous")}
          />
          <Radar
            dataKey="score"
            fill="var(--color-score)"
            fillOpacity={0.5}
            stroke="var(--color-score)"
            dot={{ r: 3, fillOpacity: 1 }}
            hide={legend.isHidden("score")}
          />
        </RadarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(qualityConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
