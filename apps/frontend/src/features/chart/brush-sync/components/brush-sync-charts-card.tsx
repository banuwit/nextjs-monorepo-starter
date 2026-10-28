"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatHour } from "@/features/chart/brush-sync/utils/brush-sync";
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import { hourlyServiceMetrics } from "@/mocks/chart-brush-sync.mock";

const metricsConfig = {
  requests: { label: "Requests", color: "var(--chart-2)" },
  latency: { label: "Latency (ms)", color: "var(--chart-4)" },
  errors: { label: "Errors", color: "var(--destructive)" },
} satisfies ChartConfig;

const SYNC_ID = "brush-sync-service";

const margin = { top: 4, left: -8, right: 8 };

const xAxisProps = {
  dataKey: "time",
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  minTickGap: 40,
  tickFormatter: (value: string) => formatHour(value),
} as const;

const yAxisProps = {
  tickLine: false,
  axisLine: false,
  width: 48,
  tickCount: 3,
  tickFormatter: (value: number) => formatCompact(value),
} as const;

const tooltip = (
  <ChartTooltip
    content={
      <ChartTooltipContent
        labelFormatter={(value) => formatHour(String(value), true)}
      />
    }
  />
);

function PanelLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-medium text-muted-foreground">{children}</p>
  );
}

export function BrushSyncChartsCard() {
  const totalRequests = sumBy(hourlyServiceMetrics, (row) => row.requests);

  return (
    <ChartCard
      title="Service health"
      description="Synchronized charts — three panels share a syncId, so hovering one shows the tooltip in all"
      value={`${formatCompact(totalRequests)} requests`}
      footer="Last 48 hours, hourly. The panels line up by index."
    >
      <div className="grid gap-2">
        <PanelLabel>Requests</PanelLabel>
        <ChartContainer
          config={metricsConfig}
          className="aspect-auto h-24 w-full"
        >
          <AreaChart
            data={hourlyServiceMetrics}
            syncId={SYNC_ID}
            accessibilityLayer
            margin={margin}
          >
            <CartesianGrid vertical={false} />
            <XAxis {...xAxisProps} hide />
            <YAxis {...yAxisProps} />
            {tooltip}
            <Area
              dataKey="requests"
              type="monotone"
              fill="var(--color-requests)"
              fillOpacity={0.2}
              stroke="var(--color-requests)"
            />
          </AreaChart>
        </ChartContainer>
        <PanelLabel>Latency</PanelLabel>
        <ChartContainer
          config={metricsConfig}
          className="aspect-auto h-24 w-full"
        >
          <LineChart
            data={hourlyServiceMetrics}
            syncId={SYNC_ID}
            accessibilityLayer
            margin={margin}
          >
            <CartesianGrid vertical={false} />
            <XAxis {...xAxisProps} hide />
            <YAxis {...yAxisProps} />
            {tooltip}
            <Line
              dataKey="latency"
              type="monotone"
              stroke="var(--color-latency)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        <PanelLabel>Errors</PanelLabel>
        <ChartContainer
          config={metricsConfig}
          className="aspect-auto h-28 w-full"
        >
          <BarChart
            data={hourlyServiceMetrics}
            syncId={SYNC_ID}
            accessibilityLayer
            margin={margin}
          >
            <CartesianGrid vertical={false} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            {tooltip}
            <Bar
              dataKey="errors"
              fill="var(--color-errors)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </ChartCard>
  );
}
