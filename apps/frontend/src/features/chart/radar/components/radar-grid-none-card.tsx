"use client";

import { PolarAngleAxis, Radar, RadarChart } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { weekdayActivity } from "@/mocks/chart-radar.mock";

const activityConfig = {
  sessions: { label: "Sessions", color: "var(--chart-4)" },
} satisfies ChartConfig;

/** Single series with dots and no grid at all. */
export function RadarGridNoneCard() {
  return (
    <ChartCard
      title="Weekday activity"
      description="Grid none — no polar grid, dots mark each value"
      footer="Thursday is the busiest day; weekends drop by more than half."
    >
      <ChartContainer
        config={activityConfig}
        className="mx-auto aspect-auto h-64 w-full max-w-md"
      >
        <RadarChart data={weekdayActivity} outerRadius="70%">
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideIndicator />}
          />
          <PolarAngleAxis dataKey="day" tick={{ fontSize: 11 }} />
          <Radar
            dataKey="sessions"
            fill="var(--color-sessions)"
            fillOpacity={0.5}
            stroke="var(--color-sessions)"
            dot={{ r: 4, fillOpacity: 1 }}
          />
        </RadarChart>
      </ChartContainer>
    </ChartCard>
  );
}
