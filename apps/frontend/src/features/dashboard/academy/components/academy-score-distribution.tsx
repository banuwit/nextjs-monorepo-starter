"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { academyScoreBuckets } from "@/mocks/dashboard-academy.mock";

import { PASSING_SCORE, percent } from "../utils/academy";
import { integer } from "../utils/format";

const chartConfig = {
  learners: { label: "Passed", color: "var(--chart-1)" },
  below: { label: `Below ${PASSING_SCORE}`, color: "var(--chart-5)" },
} satisfies ChartConfig;

export function AcademyScoreDistribution() {
  const total = academyScoreBuckets.reduce(
    (sum, bucket) => sum + bucket.learners,
    0,
  );
  const passed = academyScoreBuckets
    .filter((bucket) => bucket.min >= PASSING_SCORE)
    .reduce((sum, bucket) => sum + bucket.learners, 0);
  const passRate = percent(passed, total);
  const firstPassing = academyScoreBuckets.find(
    (bucket) => bucket.min >= PASSING_SCORE,
  );
  const lastFailing = [...academyScoreBuckets]
    .reverse()
    .find((bucket) => bucket.min < PASSING_SCORE);
  const thresholdIndex =
    firstPassing && lastFailing
      ? academyScoreBuckets.indexOf(firstPassing) - 0.5
      : null;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Quiz score distribution</CardTitle>
        <CardDescription>
          {passRate}% of {integer.format(total)} graded attempts scored{" "}
          {PASSING_SCORE} or above
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-64 w-full flex-1"
          role="img"
          aria-label={`Histogram of quiz scores in six buckets; ${passRate}% of attempts are at or above the pass mark of ${PASSING_SCORE}`}
        >
          <BarChart
            data={academyScoreBuckets}
            accessibilityLayer
            margin={{ left: 4, right: 12, top: 24 }}
          >
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis
              dataKey="range"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
              content={<ChartTooltipContent />}
            />
            {thresholdIndex !== null && (
              <ReferenceLine
                x={thresholdIndex}
                stroke="var(--foreground)"
                strokeOpacity={0.5}
                strokeDasharray="4 4"
                ifOverflow="extendDomain"
                label={{
                  value: `Pass mark ${PASSING_SCORE}`,
                  position: "top",
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
              />
            )}
            <Bar
              dataKey="learners"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            >
              {academyScoreBuckets.map((bucket) => (
                <Cell
                  key={bucket.range}
                  fill={
                    bucket.min < PASSING_SCORE
                      ? "var(--color-below)"
                      : "var(--color-learners)"
                  }
                />
              ))}
              <LabelList
                dataKey="learners"
                position="top"
                className="fill-foreground"
                fontSize={11}
                formatter={(value) => integer.format(Number(value))}
              />
            </Bar>
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
