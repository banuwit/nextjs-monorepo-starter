"use client";

import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts";

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
import { usdCompact, usdWhole } from "../utils/format";

import { cumulativeSales } from "../utils/sales";

const chartConfig = {
  today: { label: "Today", color: "var(--chart-1)" },
  yesterday: { label: "Yesterday", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

export function SalesPaceChart({
  hour,
  liveExtra,
  target,
}: {
  hour: number;
  liveExtra: number;
  target: number;
}) {
  const data = cumulativeSales(hour, liveExtra);

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Revenue pace</CardTitle>
        <CardDescription>Running total by hour, today against yesterday</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-72 w-full flex-1"
          role="img"
          aria-label={`Running revenue today compared with yesterday, against a ${usdWhole.format(target)} target`}
        >
          <ComposedChart data={data} accessibilityLayer margin={{ left: 4, right: 12, top: 16 }}>
            <defs>
              <linearGradient id="sales-pace-today" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-today)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--color-today)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} interval={3} />
            <YAxis
              width={48}
              tickLine={false}
              axisLine={false}
              domain={[0, Math.ceil(target / 10_000) * 10_000]}
              tickFormatter={(value: number) => usdCompact.format(value)}
            />
            <ReferenceLine
              y={target}
              stroke="var(--foreground)"
              strokeOpacity={0.5}
              label={{
                value: `Target ${usdCompact.format(target)}`,
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
                  formatter={(value, name, item) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="h-3 w-1 rounded-full" style={{ backgroundColor: item.color }} />
                        {chartConfig[name as keyof typeof chartConfig]?.label}
                      </span>
                      <span className="font-medium tabular-nums">{usdWhole.format(Number(value))}</span>
                    </div>
                  )}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="yesterday"
              stroke="var(--color-yesterday)"
              strokeOpacity={0.6}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="today"
              stroke="var(--color-today)"
              fill="url(#sales-pace-today)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
