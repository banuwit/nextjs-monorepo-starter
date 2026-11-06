"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { academyEnrollments } from "@/mocks/dashboard-academy.mock";

import { integer } from "../utils/format";

const chartConfig = {
  new: { label: "New learners", color: "var(--chart-1)" },
  returning: { label: "Returning", color: "var(--chart-2)" },
  active: { label: "Active learners", color: "var(--chart-1)" },
} satisfies ChartConfig;

type View = "enrollments" | "active";

export function AcademyEnrollments() {
  const [view, setView] = useState<View>("enrollments");
  const totals = academyEnrollments.reduce(
    (sum, point) => ({
      new: sum.new + point.new,
      returning: sum.returning + point.returning,
    }),
    { new: 0, returning: 0 },
  );
  const latest = academyEnrollments.at(-1)?.active ?? 0;
  const first = academyEnrollments[0]?.active ?? 0;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Enrollments</CardTitle>
        <CardDescription>
          {view === "enrollments"
            ? "New and returning learners enrolled per week, this term"
            : "Learners active in at least one course, by week"}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={[view]}
            onValueChange={(value) => {
              const next = value[0];
              if (next === "enrollments" || next === "active") setView(next);
            }}
            variant="outline"
            size="sm"
            aria-label="Series"
          >
            <ToggleGroupItem value="enrollments">Enrollments</ToggleGroupItem>
            <ToggleGroupItem value="active">Active learners</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <dl className="grid grid-cols-3 gap-3 text-sm">
          {view === "enrollments" ? (
            <>
              <div>
                <dt className="text-xs text-muted-foreground">New</dt>
                <dd className="text-xl font-semibold tabular-nums">
                  {integer.format(totals.new)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Returning</dt>
                <dd className="text-xl font-semibold tabular-nums">
                  {integer.format(totals.returning)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Total</dt>
                <dd className="text-xl font-semibold tabular-nums">
                  {integer.format(totals.new + totals.returning)}
                </dd>
              </div>
            </>
          ) : (
            <>
              <div>
                <dt className="text-xs text-muted-foreground">Week 1</dt>
                <dd className="text-xl font-semibold tabular-nums">
                  {integer.format(first)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Week 12</dt>
                <dd className="text-xl font-semibold tabular-nums">
                  {integer.format(latest)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Growth</dt>
                <dd className="text-xl font-semibold tabular-nums">
                  +{integer.format(latest - first)}
                </dd>
              </div>
            </>
          )}
        </dl>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-64 w-full flex-1"
          role="img"
          aria-label={
            view === "enrollments"
              ? "Stacked weekly enrollments of new and returning learners over 12 weeks"
              : "Active learners per week over 12 weeks"
          }
        >
          <AreaChart
            data={academyEnrollments}
            accessibilityLayer
            margin={{ left: 4, right: 12, top: 16 }}
          >
            <defs>
              <linearGradient id="academy-new" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-new)"
                  stopOpacity={0.36}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-new)"
                  stopOpacity={0.06}
                />
              </linearGradient>
              <linearGradient
                id="academy-returning"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-returning)"
                  stopOpacity={0.36}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-returning)"
                  stopOpacity={0.06}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              domain={view === "active" ? ["auto", "auto"] : [0, "auto"]}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)" }}
              content={<ChartTooltipContent indicator="line" />}
            />
            {view === "enrollments" ? (
              <>
                <Area
                  type="monotone"
                  dataKey="new"
                  stackId="enrollments"
                  stroke="var(--color-new)"
                  fill="url(#academy-new)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="returning"
                  stackId="enrollments"
                  stroke="var(--color-returning)"
                  fill="url(#academy-returning)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey="active"
                stroke="var(--color-active)"
                fill="url(#academy-new)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
