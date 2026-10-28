"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { cn } from "cn";

import { ChartCard } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import { apiMetrics } from "@/mocks/chart.mock";

const metricConfig = {
  requests: { label: "Requests", color: "var(--chart-2)" },
  latency: { label: "Latency (ms)", color: "var(--chart-3)" },
  errors: { label: "Error rate (%)", color: "var(--destructive)" },
} satisfies ChartConfig;

type Metric = keyof typeof metricConfig;

const metricSummary: Record<Metric, string> = {
  requests: formatCompact(sumBy(apiMetrics, (row) => row.requests)),
  latency: `${Math.round(sumBy(apiMetrics, (row) => row.latency) / apiMetrics.length)} ms`,
  errors: `${(sumBy(apiMetrics, (row) => row.errors) / apiMetrics.length).toFixed(2)}%`,
};

export function LineMetricSwitcherCard() {
  const [metric, setMetric] = useState<Metric>("requests");

  return (
    <ChartCard
      title="API traffic"
      description="Pick a metric tab to change the series"
    >
      <div className="mb-4 grid grid-cols-3 overflow-hidden rounded-lg border">
        {(Object.keys(metricConfig) as Metric[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={metric === key}
            onClick={() => setMetric(key)}
            className={cn(
              "flex flex-col items-start gap-0.5 border-r px-3 py-2 text-left transition-colors last:border-r-0 hover:bg-muted/50",
              metric === key && "bg-muted",
            )}
          >
            <span className="text-xs text-muted-foreground">
              {metricConfig[key].label}
            </span>
            <span className="text-lg font-semibold tabular-nums">
              {metricSummary[key]}
            </span>
          </button>
        ))}
      </div>
      <ChartContainer config={metricConfig} className="h-56 w-full">
        <LineChart
          data={apiMetrics}
          accessibilityLayer
          margin={{ left: -12, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatCompact(value)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            key={metric}
            dataKey={metric}
            type="monotone"
            stroke={`var(--color-${metric})`}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  );
}
