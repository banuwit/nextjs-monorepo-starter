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
import { logisticsFleet } from "@/mocks/dashboard-logistics.mock";

const chartConfig = {
  moving: { label: "Moving", color: "var(--chart-1)" },
  idle: { label: "Idle at depot", color: "var(--chart-3)" },
  maintenance: { label: "In maintenance", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const keys = ["moving", "idle", "maintenance"] as const;

export function LogisticsFleetUtilization() {
  const total =
    logisticsFleet.moving + logisticsFleet.idle + logisticsFleet.maintenance;
  const active = logisticsFleet.moving + logisticsFleet.idle;
  const data = [{ name: "fleet", ...logisticsFleet }];

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Fleet utilization</CardTitle>
        <CardDescription>
          {logisticsFleet.moving} of {total} vehicles on the road
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-auto h-40 w-full max-w-72"
          role="img"
          aria-label={`${logisticsFleet.moving} moving, ${logisticsFleet.idle} idle, ${logisticsFleet.maintenance} in maintenance`}
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
              content={<ChartTooltipContent hideLabel />}
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
                        {active}
                      </tspan>
                      <tspan
                        x={cx}
                        y={cy - 6}
                        className="fill-muted-foreground"
                      >
                        available of {total}
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
                stackId="fleet"
                cornerRadius={4}
                fill={`var(--color-${key})`}
                className="stroke-transparent stroke-2"
                isAnimationActive={false}
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
        <dl className="grid grid-cols-3 gap-2 text-sm">
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
                {logisticsFleet[key]}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
