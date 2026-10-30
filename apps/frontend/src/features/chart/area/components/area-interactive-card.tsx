"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { ChartCard, ChartPeriodTabs } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCompact, sumBy } from "../utils/format";
import { dailyVisitors } from "@/mocks/chart-area.mock";

const dailyConfig = {
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  mobile: { label: "Mobile", color: "var(--chart-4)" },
} satisfies ChartConfig;

const ranges = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
] as const;

type Range = (typeof ranges)[number]["value"];

const rangeDays: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90 };

function formatDay(value: string, month: "short" | "long" = "short") {
  return new Date(value).toLocaleDateString("en-US", {
    month,
    day: "numeric",
    timeZone: "UTC",
  });
}

export function AreaInteractiveCard() {
  const legend = useChartLegendToggle();
  const [range, setRange] = useState<Range>("30d");
  const data = dailyVisitors.slice(-rangeDays[range]);

  return (
    <ChartCard
      title="Daily visitors"
      description="Interactive — daily data with a 7d / 30d / 90d range switch"
      className="@4xl/main:col-span-2"
      value={formatCompact(sumBy(data, (row) => row.desktop + row.mobile))}
      action={
        <ChartPeriodTabs
          label="Range"
          value={range}
          options={ranges}
          onValueChange={setRange}
        />
      }
      footer="The tooltip uses labelFormatter to print the full date."
    >
      <ChartContainer config={dailyConfig} className="h-64 w-full">
        <AreaChart
          data={data}
          accessibilityLayer
          margin={{ left: 8, right: 8 }}
        >
          <defs>
            {Object.keys(dailyConfig).map((key) => (
              <linearGradient
                key={key}
                id={`fill-daily-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.05}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value: string) => formatDay(value)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelFormatter={(value) => formatDay(String(value), "long")}
              />
            }
          />
          <Area
            dataKey="mobile"
            type="natural"
            stackId="daily"
            fill="url(#fill-daily-mobile)"
            stroke="var(--color-mobile)"
            hide={legend.isHidden("mobile")}
          />
          <Area
            dataKey="desktop"
            type="natural"
            stackId="daily"
            fill="url(#fill-daily-desktop)"
            stroke="var(--color-desktop)"
            hide={legend.isHidden("desktop")}
          />
        </AreaChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(dailyConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
