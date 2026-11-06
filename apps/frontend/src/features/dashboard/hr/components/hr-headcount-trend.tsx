"use client";

import { useState } from "react";
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
import { hrHeadcountTrend } from "@/mocks/dashboard-hr.mock";

import { integer } from "../utils/format";
import { sumHeadcountChange, toDivergingSeries } from "../utils/hr";

const chartConfig = {
  hires: { label: "Hires", color: "var(--chart-1)" },
  exits: { label: "Exits", color: "var(--chart-5)" },
  headcount: { label: "Headcount", color: "var(--foreground)" },
} satisfies ChartConfig;

type Range = "6m" | "12m";

export function HrHeadcountTrend() {
  const [range, setRange] = useState<Range>("12m");
  const points = range === "6m" ? hrHeadcountTrend.slice(-6) : hrHeadcountTrend;
  const totals = sumHeadcountChange(points);
  const net = totals.hires - totals.exits;
  const series = toDivergingSeries(points);
  const months = range === "6m" ? "six" : "twelve";

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Headcount movement</CardTitle>
        <CardDescription>
          Hires above the line, exits below, with month-end headcount
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={[range]}
            onValueChange={(value) => {
              const next = value[0];
              if (next === "6m" || next === "12m") setRange(next);
            }}
            variant="outline"
            size="sm"
            aria-label="Period"
          >
            <ToggleGroupItem value="6m">6M</ToggleGroupItem>
            <ToggleGroupItem value="12m">12M</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Hired</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {totals.hires}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Left</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {totals.exits}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Net change</dt>
            <dd className="text-xl font-semibold tabular-nums">
              {net > 0 ? `+${net}` : net}
            </dd>
          </div>
        </dl>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-64 w-full flex-1"
          role="img"
          aria-label={`Monthly hires and exits over the last ${months} months, with headcount ending at ${integer.format(points[points.length - 1]?.headcount ?? 0)}`}
        >
          <ComposedChart
            data={series}
            accessibilityLayer
            stackOffset="sign"
            margin={{ left: 4, right: 4, top: 16 }}
          >
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="moves"
              width={32}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tickFormatter={(value) => `${Math.abs(Number(value))}`}
            />
            <YAxis
              yAxisId="headcount"
              orientation="right"
              width={44}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 20", "dataMax + 20"]}
              tickFormatter={(value) => integer.format(Number(value))}
            />
            <ReferenceLine
              yAxisId="moves"
              y={0}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    const key = String(name) as keyof typeof chartConfig;
                    const label = chartConfig[key]?.label ?? key;
                    return (
                      <>
                        <div
                          className="size-2.5 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: `var(--color-${key})` }}
                        />
                        <span className="text-muted-foreground">{label}</span>
                        <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                          {integer.format(Math.abs(Number(value)))}
                        </span>
                      </>
                    );
                  }}
                />
              }
            />
            <Bar
              yAxisId="moves"
              dataKey="hires"
              stackId="moves"
              fill="var(--color-hires)"
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
              isAnimationActive={false}
            />
            <Bar
              yAxisId="moves"
              dataKey="exits"
              stackId="moves"
              fill="var(--color-exits)"
              radius={[0, 0, 3, 3]}
              maxBarSize={28}
              isAnimationActive={false}
            />
            <Line
              yAxisId="headcount"
              type="monotone"
              dataKey="headcount"
              stroke="var(--color-headcount)"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 0, fill: "var(--color-headcount)" }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
