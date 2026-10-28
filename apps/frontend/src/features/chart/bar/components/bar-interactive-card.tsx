"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { cn } from "cn";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sumBy } from "@/features/chart/utils/format";
import { dailyPageViews } from "@/mocks/chart-bar.mock";

const pageViewsConfig = {
  views: { label: "Page views" },
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  mobile: { label: "Mobile", color: "var(--chart-4)" },
} satisfies ChartConfig;

type Platform = "desktop" | "mobile";

const platformTotals: Record<Platform, number> = {
  desktop: sumBy(dailyPageViews, (row) => row.desktop),
  mobile: sumBy(dailyPageViews, (row) => row.mobile),
};

function formatDay(value: string, month: "short" | "long" = "short") {
  return new Date(value).toLocaleDateString("en-US", {
    month,
    day: "numeric",
    year: month === "long" ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

export function BarInteractiveCard() {
  const [platform, setPlatform] = useState<Platform>("desktop");

  return (
    <ChartCard
      title="Page views"
      description="Interactive — click a KPI to switch the series over 90 days of daily data"
      className="@4xl/main:col-span-2"
    >
      <div className="mb-4 grid grid-cols-2 overflow-hidden rounded-lg border">
        {(Object.keys(platformTotals) as Platform[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={platform === key}
            onClick={() => setPlatform(key)}
            className={cn(
              "flex flex-col items-start gap-0.5 border-r px-3 py-2 text-left transition-colors last:border-r-0 hover:bg-muted/50",
              platform === key && "bg-muted",
            )}
          >
            <span className="text-xs text-muted-foreground">
              {pageViewsConfig[key].label}
            </span>
            <span className="text-lg font-semibold tabular-nums">
              {platformTotals[key].toLocaleString("en-US")}
            </span>
          </button>
        ))}
      </div>
      <ChartContainer config={pageViewsConfig} className="h-56 w-full">
        <BarChart
          data={dailyPageViews}
          accessibilityLayer
          margin={{ left: 8, right: 8 }}
        >
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
                className="w-40"
                nameKey="views"
                labelFormatter={(value) => formatDay(String(value), "long")}
              />
            }
          />
          <Bar dataKey={platform} fill={`var(--color-${platform})`} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
