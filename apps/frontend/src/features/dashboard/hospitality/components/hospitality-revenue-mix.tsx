"use client";

import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { hospitalityRevenue } from "@/mocks/dashboard-hospitality.mock";

import {
  formatIdr,
  formatIdrCompact,
  sharePercent,
} from "../utils/hospitality";

const chartConfig = {
  rooms: { label: "Rooms", color: "var(--chart-1)" },
  fnb: { label: "F&B", color: "var(--chart-2)" },
  spa: { label: "Spa", color: "var(--chart-3)" },
  events: { label: "Events", color: "var(--chart-4)" },
} satisfies ChartConfig;

const keys = ["rooms", "fnb", "spa", "events"] as const;

export function HospitalityRevenueMix() {
  const total = keys.reduce((sum, key) => sum + hospitalityRevenue[key], 0);
  const data = [{ name: "revenue", ...hospitalityRevenue }];

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Revenue mix</CardTitle>
        <CardDescription>
          Tonight&apos;s revenue by segment, rooms{" "}
          {sharePercent(hospitalityRevenue.rooms, total)}% of the total
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-auto h-40 w-full max-w-72"
          role="img"
          aria-label={`Revenue tonight ${formatIdr(total)}: ${keys
            .map(
              (key) =>
                `${chartConfig[key].label} ${formatIdr(hospitalityRevenue[key])}`,
            )
            .join(", ")}`}
        >
          <RadialBarChart
            data={data}
            cy="90%"
            startAngle={180}
            endAngle={0}
            innerRadius={90}
            outerRadius={124}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
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
                        {formatIdr(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <PolarAngleAxis
              type="number"
              domain={[0, total]}
              tick={false}
              axisLine={false}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;
                  const cx = viewBox.cx ?? 0;
                  const cy = viewBox.cy ?? 0;
                  return (
                    <text x={cx} y={cy} textAnchor="middle">
                      <tspan
                        x={cx}
                        y={cy - 26}
                        className="fill-foreground text-2xl font-semibold"
                      >
                        {formatIdrCompact(total)}
                      </tspan>
                      <tspan
                        x={cx}
                        y={cy - 6}
                        className="fill-muted-foreground"
                      >
                        total tonight
                      </tspan>
                    </text>
                  );
                }}
              />
            </PolarRadiusAxis>
            {keys.map((key) => (
              <RadialBar
                key={key}
                dataKey={key}
                stackId="revenue"
                cornerRadius={4}
                fill={`var(--color-${key})`}
                className="stroke-transparent stroke-2"
                isAnimationActive={false}
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          {keys.map((key) => (
            <div key={key} className="flex flex-col gap-0.5">
              <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full"
                  style={{ backgroundColor: chartConfig[key].color }}
                />
                {chartConfig[key].label}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatIdrCompact(hospitalityRevenue[key])}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
