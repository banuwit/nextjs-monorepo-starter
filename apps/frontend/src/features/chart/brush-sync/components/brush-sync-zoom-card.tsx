"use client";

import { RotateCcwIcon } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useZoomSelection } from "@/features/chart/brush-sync/hooks/use-zoom-selection";
import {
  formatDay,
  valueDomain,
} from "@/features/chart/brush-sync/utils/brush-sync";
import { dailyLatency } from "@/mocks/chart-brush-sync.mock";

const latencyConfig = {
  p50: { label: "p50", color: "var(--chart-2)" },
  p95: { label: "p95", color: "var(--chart-4)" },
} satisfies ChartConfig;

const latencyKeys = ["p50", "p95"] as const;

export function BrushSyncZoomCard() {
  const legend = useChartLegendToggle();
  const zoom = useZoomSelection();

  const domain = zoom.domain;
  const rows = domain
    ? dailyLatency.filter((row) => row.ts >= domain[0] && row.ts <= domain[1])
    : dailyLatency;
  const shownKeys = latencyKeys.filter((key) => !legend.isHidden(key));
  const yDomain = valueDomain(
    rows,
    shownKeys.length ? shownKeys : latencyKeys,
    50,
  );
  const first = rows[0];
  const last = rows[rows.length - 1];

  return (
    <ChartCard
      title="API latency"
      description="Highlight & zoom — drag across the chart to zoom into that range (mouse)"
      value={
        first && last
          ? `${formatDay(first.ts)} – ${formatDay(last.ts)}`
          : undefined
      }
      action={
        <Button
          variant="outline"
          size="sm"
          disabled={!zoom.isZoomed}
          onClick={zoom.reset}
        >
          <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
          Reset zoom
        </Button>
      }
      footer="The Y axis is recomputed for the zoomed window and the shown series."
    >
      <ChartContainer
        config={latencyConfig}
        className="aspect-auto h-72 w-full select-none"
      >
        <LineChart
          data={dailyLatency}
          accessibilityLayer
          margin={{ left: 0, right: 8 }}
          {...zoom.handlers}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="ts"
            type="number"
            domain={domain ?? ["dataMin", "dataMax"]}
            allowDataOverflow
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value: number) => formatDay(value)}
          />
          <YAxis
            domain={yDomain}
            allowDataOverflow
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(value: number) => `${value}ms`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const ts = payload?.[0]?.payload?.ts;
                  return typeof ts === "number" ? formatDay(ts, "long") : "";
                }}
                formatter={(value, name) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {String(value)}ms
                    </span>
                  </div>
                )}
              />
            }
          />
          {latencyKeys.map((key) => (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
              hide={legend.isHidden(key)}
            />
          ))}
          {zoom.selection && (
            <ReferenceArea
              x1={zoom.selection.x1}
              x2={zoom.selection.x2}
              fill="var(--chart-3)"
              fillOpacity={0.15}
              stroke="var(--chart-3)"
              strokeOpacity={0.4}
            />
          )}
        </LineChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(latencyConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
