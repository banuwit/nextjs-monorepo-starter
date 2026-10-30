"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCompact, sumBy } from "../utils/format";
import { dailySessionsByWeek } from "@/mocks/chart-bar.mock";

const sessionsConfig = {
  sessions: { label: "Sessions", color: "var(--chart-2)" },
} satisfies ChartConfig;

/** Index of the middle day of each 7-day week, where the week label goes. */
const WEEK_LABEL_INDEX = 3;

export function BarMultiXAxisCard() {
  return (
    <ChartCard
      title="Daily sessions"
      description="Multi X axis — days on the first axis, weeks grouped on a second axis"
      value={formatCompact(sumBy(dailySessionsByWeek, (row) => row.sessions))}
      change={7.1}
    >
      <ChartContainer config={sessionsConfig} className="h-64 w-full">
        <BarChart
          data={dailySessionsByWeek}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
          />
          <XAxis
            xAxisId="week"
            dataKey="week"
            tickLine={false}
            axisLine={false}
            interval={0}
            tickFormatter={(value: string, index: number) =>
              index % 7 === WEEK_LABEL_INDEX ? value : ""
            }
            className="font-medium"
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const row = payload[0]?.payload as
                    (typeof dailySessionsByWeek)[number] | undefined;
                  return row ? `Oct ${Number(row.day)}` : "";
                }}
              />
            }
          />
          <Bar dataKey="sessions" fill="var(--color-sessions)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
