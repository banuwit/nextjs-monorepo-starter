"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sumBy } from "../utils/format";
import { teamGoalCompletion } from "@/mocks/chart-bar.mock";

const goalConfig = {
  completion: { label: "Completion", color: "var(--chart-1)" },
} satisfies ChartConfig;

const average = Math.round(
  sumBy(teamGoalCompletion, (row) => row.completion) /
    teamGoalCompletion.length,
);

export function BarBackgroundCard() {
  return (
    <ChartCard
      title="Goal completion by team"
      description="With background — a muted track shows the remaining distance to 100%"
      value={`${average}%`}
      change={6.2}
      footer="Average completion of the quarterly target."
    >
      <ChartContainer config={goalConfig} className="h-64 w-full">
        <BarChart
          data={teamGoalCompletion}
          layout="vertical"
          accessibilityLayer
          margin={{ left: 0, right: 40 }}
        >
          <YAxis
            dataKey="team"
            type="category"
            tickLine={false}
            axisLine={false}
            width={76}
          />
          <XAxis type="number" domain={[0, 100]} hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                formatter={(value) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {Number(value)}%
                    </span>
                  </div>
                )}
              />
            }
          />
          <Bar
            dataKey="completion"
            fill="var(--color-completion)"
            radius={6}
            barSize={18}
            background={{ fill: "var(--muted)", radius: 6 }}
          >
            <LabelList
              dataKey="completion"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
              formatter={(value) => `${Number(value)}%`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
