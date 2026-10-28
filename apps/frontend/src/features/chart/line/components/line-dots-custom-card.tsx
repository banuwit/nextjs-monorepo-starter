"use client";

import { GitCommitVerticalIcon } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sumBy } from "@/features/chart/utils/format";
import { releaseCommits } from "@/mocks/chart-line.mock";

const commitsConfig = {
  commits: { label: "Commits", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function LineDotsCustomCard() {
  return (
    <ChartCard
      title="Commits"
      description="Dots custom — a render function draws an icon at every point"
      value={sumBy(releaseCommits, (row) => row.commits).toLocaleString(
        "en-US",
      )}
      change={14.2}
    >
      <ChartContainer config={commitsConfig} className="h-64 w-full">
        <LineChart
          data={releaseCommits}
          accessibilityLayer
          margin={{ top: 12, left: -20, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="commits"
            type="natural"
            stroke="var(--color-commits)"
            strokeWidth={2}
            dot={({ cx, cy, index }) => (
              <GitCommitVerticalIcon
                key={index}
                x={Number(cx) - 12}
                y={Number(cy) - 12}
                width={24}
                height={24}
                className="fill-background stroke-(--color-commits)"
              />
            )}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
