"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
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
import { uptimeSeries } from "@/mocks/chart.mock";

const uptimeConfig = {
  uptime: { label: "Uptime (%)", color: "var(--chart-1)" },
  slo: { label: "SLO target", color: "var(--destructive)" },
} satisfies ChartConfig;

const UPTIME_SLO = 99.9;

export function LineUptimeCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Uptime"
      description={`Daily uptime with a ${UPTIME_SLO}% SLO reference line`}
      value="99.91%"
      change={0.1}
      footer="Dips below the dashed line breach the SLO."
    >
      <ChartContainer config={uptimeConfig} className="h-64 w-full">
        <LineChart
          data={uptimeSeries}
          accessibilityLayer
          margin={{ left: -4, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis domain={[99.6, 100]} tickLine={false} axisLine={false} />
          {!legend.isHidden("slo") && (
            <ReferenceLine
              y={UPTIME_SLO}
              stroke="var(--destructive)"
              strokeDasharray="4 4"
              label={{
                value: "SLO",
                position: "insideTopRight",
                fill: "var(--destructive)",
                fontSize: 11,
              }}
            />
          )}
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideIndicator />}
          />
          <Line
            dataKey="uptime"
            type="linear"
            stroke="var(--color-uptime)"
            strokeWidth={2}
            hide={legend.isHidden("uptime")}
          />
        </LineChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(uptimeConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
