"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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
  healthcareFlowToday,
  healthcareFlowYesterday,
} from "@/mocks/dashboard-healthcare.mock";

import { currentHourLabel, summarizeFlow } from "../utils/healthcare";

const chartConfig = {
  arrivals: { label: "Arrived", color: "var(--chart-1)" },
  seen: { label: "Seen by a doctor", color: "var(--chart-2)" },
} satisfies ChartConfig;

type Range = "today" | "yesterday";

export function HealthcarePatientFlow({ hour }: { hour: number }) {
  const [range, setRange] = useState<Range>("today");
  const source =
    range === "today" ? healthcareFlowToday : healthcareFlowYesterday;
  const summary = summarizeFlow(source, range === "today" ? hour : 24);
  const nowLabel = range === "today" ? currentHourLabel(source, hour) : null;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Patient flow</CardTitle>
        <CardDescription>
          Arrivals against consultations started, by hour
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={[range]}
            onValueChange={(value) => {
              const next = value[0];
              if (next === "today" || next === "yesterday") setRange(next);
            }}
            variant="outline"
            size="sm"
            aria-label="Day"
          >
            <ToggleGroupItem value="today">Today</ToggleGroupItem>
            <ToggleGroupItem value="yesterday">Yesterday</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Arrived</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {summary.arrivals}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Seen</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {summary.seen}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Waiting now</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {summary.waiting}
            </dd>
          </div>
        </dl>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-64 w-full flex-1"
          role="img"
          aria-label={`Hourly arrivals and consultations ${range === "today" ? "today" : "yesterday"}`}
        >
          <AreaChart
            data={summary.visible}
            accessibilityLayer
            margin={{ left: 4, right: 12, top: 16 }}
          >
            <defs>
              <linearGradient
                id="healthcare-arrivals"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-arrivals)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-arrivals)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="healthcare-seen" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-seen)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-seen)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={1}
            />
            <YAxis
              width={32}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            {nowLabel && (
              <ReferenceLine
                x={nowLabel}
                stroke="var(--foreground)"
                strokeOpacity={0.5}
                strokeDasharray="4 4"
                label={{
                  value: "Now",
                  position: "insideTopRight",
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
              />
            )}
            <ChartTooltip
              cursor={{ stroke: "var(--border)" }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              type="monotone"
              dataKey="arrivals"
              stroke="var(--color-arrivals)"
              fill="url(#healthcare-arrivals)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="seen"
              stroke="var(--color-seen)"
              fill="url(#healthcare-seen)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
