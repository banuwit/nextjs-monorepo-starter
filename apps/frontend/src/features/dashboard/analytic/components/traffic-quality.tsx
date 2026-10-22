"use client";

import { Ellipsis } from "lucide-react";
import { qualitySeries } from "@/mocks/dashboard-analytic.mock";
import { CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  actualQuality: {
    color: "var(--chart-3)",
    label: "Actual quality",
  },
  baselineQuality: {
    color: "var(--muted-foreground)",
    label: "Baseline quality",
  },
} satisfies ChartConfig;

const chartData = qualitySeries.map((item, index) => ({
  ...item,
  dayIndex: 1 + (index * 27) / (qualitySeries.length - 1),
}));

const weeklyTicks = [4, 11, 18, 25];

function formatWeek(value: number) {
  const weekIndex = weeklyTicks.indexOf(value);

  return weekIndex >= 0 ? `Week ${weekIndex + 1}` : "";
}

export function TrafficQuality() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Traffic Quality</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-68 w-full">
          <ComposedChart
            data={chartData}
            margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dayIndex"
              axisLine={false}
              domain={[1, 28]}
              interval={0}
              tickFormatter={formatWeek}
              tickLine={false}
              tickMargin={14}
              ticks={weeklyTicks}
              type="number"
            />
            <YAxis
              axisLine={false}
              domain={[-6, 6]}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              tickMargin={10}
              width={34}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-40"
                  labelFormatter={() => "Traffic quality"}
                />
              }
            />
            <Line
              dataKey="baselineQuality"
              dot={false}
              stroke="var(--color-baselineQuality)"
              strokeOpacity={0.65}
              strokeDasharray="4 4"
              strokeWidth={1.75}
              type="linear"
            />
            <Line
              dataKey="actualQuality"
              dot={false}
              activeDot={{ r: 4 }}
              stroke="var(--color-actualQuality)"
              strokeWidth={2.5}
              type="linear"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
