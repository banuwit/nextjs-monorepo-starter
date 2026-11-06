"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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
import { cn } from "@/lib/utils";
import {
  humanResourceEngagement,
  humanResourceEngagementResponse,
} from "@/mocks/dashboard-human-resource.mock";

import { integer } from "../utils/format";
import { sharePercent } from "../utils/human-resource";
import { TrendDelta } from "./trend-delta";

const chartConfig = {
  current: { label: "This quarter", color: "var(--chart-1)" },
  previous: { label: "Last quarter", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function HumanResourceEngagement() {
  const average = Math.round(
    humanResourceEngagement.reduce((sum, point) => sum + point.current, 0) /
      humanResourceEngagement.length,
  );
  const responseRate = sharePercent(
    humanResourceEngagementResponse.responded,
    humanResourceEngagementResponse.invited,
  );
  const lowest = humanResourceEngagement.reduce((min, point) =>
    point.current < min.current ? point : min,
  );

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Engagement survey</CardTitle>
        <CardDescription>
          Favourable score per dimension, this quarter against last
        </CardDescription>
      </CardHeader>
      <CardContent className="grid flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-72 w-full"
          role="img"
          aria-label={`Engagement radar: average ${average}% favourable this quarter, lowest on ${lowest.dimension} at ${lowest.current}%`}
        >
          <RadarChart
            data={humanResourceEngagement}
            accessibilityLayer
            margin={{ top: 12, right: 24, bottom: 12, left: 24 }}
          >
            <PolarGrid gridType="polygon" strokeOpacity={0.6} />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={false}
              axisLine={false}
              tickCount={5}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Radar
              dataKey="previous"
              stroke="var(--color-previous)"
              fill="var(--color-previous)"
              fillOpacity={0.12}
              strokeDasharray="4 3"
              strokeWidth={1.5}
              isAnimationActive={false}
            />
            <Radar
              dataKey="current"
              stroke="var(--color-current)"
              fill="var(--color-current)"
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ r: 3, fillOpacity: 1 }}
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
        <div className="flex flex-col gap-3">
          <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-1">
            <div>
              <dt className="text-xs text-muted-foreground">Average</dt>
              <dd className="text-xl font-semibold tabular-nums">{average}%</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Response rate</dt>
              <dd className="text-xl font-semibold tabular-nums">
                {responseRate}%{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {integer.format(humanResourceEngagementResponse.responded)} of{" "}
                  {integer.format(humanResourceEngagementResponse.invited)}
                </span>
              </dd>
            </div>
          </dl>
          <ul className="flex flex-col divide-y text-sm">
            {humanResourceEngagement.map((point) => {
              const change = point.current - point.previous;
              return (
                <li
                  key={point.dimension}
                  className="flex items-center justify-between gap-2 py-1.5"
                >
                  <span className="truncate text-muted-foreground">
                    {point.dimension}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        "font-medium tabular-nums",
                        point.current < 65 && "text-destructive",
                      )}
                    >
                      {point.current}
                    </span>
                    <TrendDelta
                      delta={{
                        value: `${Math.abs(change)} pts`,
                        direction:
                          change > 0 ? "up" : change < 0 ? "down" : "flat",
                        sentiment:
                          change > 0 ? "good" : change < 0 ? "bad" : "neutral",
                      }}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
