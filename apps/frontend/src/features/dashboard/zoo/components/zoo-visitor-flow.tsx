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
import { zooFlowToday, zooFlowYesterday } from "@/mocks/dashboard-zoo.mock";

import { integer } from "../utils/format";
import { currentHourLabel, summarizeFlow } from "../utils/zoo";

const chartConfig = {
  entries: { label: "Entries", color: "var(--chart-1)" },
  exits: { label: "Exits", color: "var(--chart-2)" },
} satisfies ChartConfig;

type Range = "today" | "yesterday";

export function ZooVisitorFlow({ hour }: { hour: number }) {
  const [range, setRange] = useState<Range>("today");
  const source = range === "today" ? zooFlowToday : zooFlowYesterday;
  const summary = summarizeFlow(source, range === "today" ? hour : 24);
  const nowLabel = range === "today" ? currentHourLabel(source, hour) : null;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Visitor flow</CardTitle>
        <CardDescription>
          Gate entries against exits, by hour from 08:00 to 18:00
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
            <dt className="text-xs text-muted-foreground">Entries</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {integer.format(summary.entries)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Exits</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {integer.format(summary.exits)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              {range === "today" ? "Inside now" : "Inside at close"}
            </dt>
            <dd className="text-xl font-semibold tabular-nums">
              {integer.format(summary.inside)}
            </dd>
          </div>
        </dl>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-64 w-full flex-1"
          role="img"
          aria-label={`Hourly visitor entries and exits ${range === "today" ? "today" : "yesterday"}`}
        >
          <AreaChart
            data={summary.visible}
            accessibilityLayer
            margin={{ left: 4, right: 12, top: 16 }}
          >
            <defs>
              <linearGradient id="zoo-entries" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-entries)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-entries)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="zoo-exits" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-exits)"
                  stopOpacity={0.28}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-exits)"
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
              width={36}
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
              dataKey="entries"
              stroke="var(--color-entries)"
              fill="url(#zoo-entries)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="exits"
              stroke="var(--color-exits)"
              fill="url(#zoo-exits)"
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
