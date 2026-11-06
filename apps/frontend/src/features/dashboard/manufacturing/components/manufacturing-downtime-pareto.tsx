"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
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
import { manufacturingDowntime } from "@/mocks/dashboard-manufacturing.mock";

import { formatMinutes, paretoRows } from "../utils/manufacturing";

const chartConfig = {
  minutes: { label: "Minutes lost", color: "var(--chart-1)" },
  cumulative: { label: "Cumulative %", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function ManufacturingDowntimePareto() {
  const rows = paretoRows(manufacturingDowntime);
  const total = rows.reduce((sum, row) => sum + row.minutes, 0);
  const topTwo = rows.slice(0, 2).reduce((sum, row) => sum + row.minutes, 0);
  const topShare = total ? Math.round((topTwo / total) * 100) : 0;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Downtime Pareto</CardTitle>
        <CardDescription>
          {formatMinutes(total)} lost this week. The top two causes account for{" "}
          {topShare}%.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-x-auto">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-64 w-full min-w-[22rem] flex-1"
          role="img"
          aria-label="Downtime minutes by cause, sorted, with the cumulative share on the right axis"
        >
          <ComposedChart
            data={rows}
            accessibilityLayer
            margin={{ left: 0, right: 4, top: 12 }}
          >
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis
              dataKey="reason"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tick={{ fontSize: 11 }}
              tickFormatter={(value: string) =>
                value.length > 11 ? `${value.slice(0, 10)}…` : value
              }
            />
            <YAxis
              yAxisId="left"
              width={36}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={40}
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}%`}
            />
            <ReferenceLine
              yAxisId="right"
              y={80}
              stroke="var(--foreground)"
              strokeOpacity={0.4}
              strokeDasharray="4 4"
              label={{
                value: "80%",
                position: "insideTopRight",
                fill: "var(--muted-foreground)",
                fontSize: 11,
              }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
              content={<ChartTooltipContent />}
            />
            <Bar
              yAxisId="left"
              dataKey="minutes"
              fill="var(--color-minutes)"
              radius={4}
              maxBarSize={36}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              dataKey="cumulative"
              type="monotone"
              stroke="var(--color-cumulative)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-cumulative)" }}
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
