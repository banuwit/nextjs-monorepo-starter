"use client";

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { npsScores } from "@/mocks/chart-line.mock";

const npsConfig = {
  score: { label: "NPS", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function LineLabelCard() {
  return (
    <ChartCard
      title="Net promoter score"
      description="Label — LabelList prints each value above its point"
      value="48"
      change={-5.9}
    >
      <ChartContainer config={npsConfig} className="h-64 w-full">
        <LineChart
          data={npsScores}
          accessibilityLayer
          margin={{ top: 24, left: 16, right: 16 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="quarter"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
            padding={{ left: 16, right: 16 }}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Line
            dataKey="score"
            type="natural"
            stroke="var(--color-score)"
            strokeWidth={2}
            dot={{ fill: "var(--color-score)" }}
            activeDot={{ r: 6 }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
