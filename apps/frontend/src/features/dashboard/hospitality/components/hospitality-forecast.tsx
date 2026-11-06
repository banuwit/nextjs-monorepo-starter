"use client";

import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  hospitalityForecast,
  hospitalityOccupancyFloor,
} from "@/mocks/dashboard-hospitality.mock";

import {
  formatIdr,
  formatIdrCompact,
  formatWeekday,
  summarizeForecast,
} from "../utils/hospitality";

const chartConfig = {
  occupancy: { label: "Occupancy", color: "var(--chart-1)" },
  soft: {
    label: `Below ${hospitalityOccupancyFloor}%`,
    color: "var(--chart-5)",
  },
  adr: { label: "ADR", color: "var(--chart-3)" },
} satisfies ChartConfig;

type Window = "next" | "last";

export function HospitalityForecast({ today }: { today: string }) {
  const [window, setWindow] = useState<Window>("next");
  const days = hospitalityForecast(today);
  const visible = days.filter((day) =>
    window === "next"
      ? day.offset >= 0 && day.offset <= 6
      : day.offset >= -6 && day.offset <= 0,
  );
  const data = visible.map((day) => ({
    ...day,
    label: formatWeekday(day.date),
  }));
  const tonight = days.find((day) => day.offset === 0);
  const todayLabel = tonight ? formatWeekday(tonight.date) : "";
  const summary = summarizeForecast(visible);
  const soft = visible.filter(
    (day) => day.occupancy < hospitalityOccupancyFloor,
  ).length;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Rate &amp; occupancy forecast</CardTitle>
        <CardDescription aria-live="polite">
          {window === "next"
            ? `Next 7 nights on the books. ${
                soft
                  ? `${soft} soft ${soft === 1 ? "night" : "nights"} below ${hospitalityOccupancyFloor}% occupancy.`
                  : "Every night is above the occupancy floor."
              }`
            : "Last 7 nights sold, with the realised average daily rate."}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={[window]}
            onValueChange={(value) => {
              const next = value[0];
              if (next === "next" || next === "last") setWindow(next);
            }}
            variant="outline"
            size="sm"
            aria-label="Forecast window"
          >
            <ToggleGroupItem value="next">Next 7 days</ToggleGroupItem>
            <ToggleGroupItem value="last">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">
              {window === "next" ? "Forecast occupancy" : "Average occupancy"}
            </dt>
            <dd className="text-xl font-semibold tabular-nums">
              {summary.occupancy}%
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Average ADR</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {formatIdrCompact(summary.adr)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Rooms to sell tonight
            </dt>
            <dd className="text-xl font-semibold tabular-nums">
              {tonight?.roomsToSell ?? 0}
            </dd>
          </div>
        </dl>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-60 w-full flex-1"
          role="img"
          aria-label={`Occupancy percentage as bars and average daily rate as a line for the ${
            window === "next" ? "next" : "last"
          } seven nights, with tonight marked`}
        >
          <ComposedChart
            data={data}
            accessibilityLayer
            margin={{ left: 0, right: 0, top: 16 }}
          >
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
            />
            <YAxis
              yAxisId="left"
              width={40}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value: number) => `${value}%`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={64}
              tickLine={false}
              axisLine={false}
              domain={[1_000_000, 1_500_000]}
              ticks={[1_000_000, 1_250_000, 1_500_000]}
              tick={{ fontSize: 11 }}
              tickFormatter={(value: number) => formatIdrCompact(value)}
            />
            {todayLabel && (
              <ReferenceLine
                yAxisId="left"
                x={todayLabel}
                stroke="var(--foreground)"
                strokeOpacity={0.5}
                strokeDasharray="4 4"
                label={{
                  value: "Tonight",
                  position: "top",
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
              />
            )}
            <ChartTooltip
              cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                          className="size-2.5 rounded-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-medium tabular-nums">
                        {name === "adr"
                          ? formatIdr(Number(value))
                          : `${Number(value)}%`}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Bar
              yAxisId="left"
              dataKey="occupancy"
              radius={4}
              maxBarSize={40}
              isAnimationActive={false}
            >
              {data.map((day) => (
                <Cell
                  key={day.date}
                  fill={
                    day.occupancy < hospitalityOccupancyFloor
                      ? "var(--color-soft)"
                      : "var(--color-occupancy)"
                  }
                  fillOpacity={day.offset > 0 ? 0.7 : 1}
                />
              ))}
              <LabelList
                dataKey="occupancy"
                position="top"
                className="fill-foreground"
                fontSize={11}
                formatter={(value) => `${Number(value)}%`}
              />
            </Bar>
            <Line
              yAxisId="right"
              dataKey="adr"
              type="monotone"
              stroke="var(--color-adr)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-adr)" }}
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
