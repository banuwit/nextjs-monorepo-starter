"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  logisticsOnTimeSeries,
  logisticsSla,
} from "@/mocks/dashboard-logistics.mock";

import { formatShortDay, summarizeOnTime } from "../utils/logistics";

const chartConfig = {
  onTime: { label: "On-time rate", color: "var(--chart-1)" },
} satisfies ChartConfig;

type Range = "7" | "30";

export function LogisticsOnTime({ today }: { today: string }) {
  const [range, setRange] = useState<Range>("30");
  const series = logisticsOnTimeSeries(today);
  const data = series.slice(-Number(range));
  const summary = summarizeOnTime(data, logisticsSla);

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>On-time delivery</CardTitle>
        <CardDescription>
          Share of deliveries inside the promised window, against the{" "}
          {logisticsSla}% SLA
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={[range]}
            onValueChange={(value) => {
              const next = value[0];
              if (next === "7" || next === "30") setRange(next);
            }}
            variant="outline"
            size="sm"
            aria-label="Range"
          >
            <ToggleGroupItem value="7">7D</ToggleGroupItem>
            <ToggleGroupItem value="30">30D</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Average</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {summary.average}%
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Days under SLA</dt>
            <dd
              className={
                summary.underSla
                  ? "text-xl font-semibold text-destructive tabular-nums"
                  : "text-xl font-semibold tabular-nums"
              }
            >
              {summary.underSla} of {data.length}
            </dd>
          </div>
        </dl>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-56 w-full flex-1"
          role="img"
          aria-label={`Daily on-time rate for the last ${range} days against a ${logisticsSla}% SLA`}
        >
          <LineChart
            data={data}
            accessibilityLayer
            margin={{ left: 4, right: 12, top: 12 }}
          >
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={range === "7" ? 0 : 4}
              tickFormatter={(value: string) => formatShortDay(value)}
            />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              domain={[88, 100]}
              ticks={[88, 91, 94, 97, 100]}
              tickFormatter={(value: number) => `${value}%`}
            />
            <ReferenceArea
              y1={88}
              y2={logisticsSla}
              fill="var(--destructive)"
              fillOpacity={0.05}
            />
            <ReferenceLine
              y={logisticsSla}
              stroke="var(--foreground)"
              strokeOpacity={0.5}
              strokeDasharray="4 4"
              label={{
                value: `SLA ${logisticsSla}%`,
                position: "insideTopLeft",
                fill: "var(--muted-foreground)",
                fontSize: 11,
              }}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)" }}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) => formatShortDay(String(value))}
                  formatter={(value, name, item) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                          className="h-3 w-1 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-medium tabular-nums">
                        {Number(value)}% · {item.payload?.deliveries} deliveries
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="onTime"
              stroke="var(--color-onTime)"
              strokeWidth={2}
              dot={
                range === "7" ? { r: 3, fill: "var(--color-onTime)" } : false
              }
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
