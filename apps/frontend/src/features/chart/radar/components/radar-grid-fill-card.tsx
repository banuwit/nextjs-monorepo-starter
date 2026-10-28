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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sumBy } from "@/features/chart/utils/format";
import { supportSatisfaction } from "@/mocks/chart-radar.mock";

const satisfactionConfig = {
  score: { label: "Score", color: "var(--chart-1)" },
} satisfies ChartConfig;

/** Single series on a filled polygon grid. */
export function RadarGridFillCard() {
  const average =
    sumBy(supportSatisfaction, (row) => row.score) / supportSatisfaction.length;

  return (
    <ChartCard
      title="Support satisfaction"
      description="Grid fill — the polygon grid is tinted with the series color"
      value={average.toFixed(0)}
      change={2.1}
    >
      <ChartContainer
        config={satisfactionConfig}
        className="mx-auto aspect-auto h-64 w-full max-w-md"
      >
        <RadarChart data={supportSatisfaction} outerRadius="70%">
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarGrid className="fill-(--color-score) opacity-20" />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="score"
            fill="var(--color-score)"
            fillOpacity={0.5}
            stroke="var(--color-score)"
          />
        </RadarChart>
      </ChartContainer>
    </ChartCard>
  );
}
