"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sensorReadings } from "@/mocks/chart-area.mock";

const sensorConfig = {
  indoor: { label: "Indoor (gaps)", color: "var(--chart-2)" },
  outdoor: { label: "Outdoor (connectNulls)", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function AreaConnectNullsCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Sensor temperature"
      description="Connect nulls — missed readings leave a gap, or are bridged with connectNulls"
      value="24°C"
      footer="Indoor keeps the default gaps; outdoor sets connectNulls to draw through null values."
    >
      <ChartContainer config={sensorConfig} className="h-64 w-full">
        <AreaChart
          data={sensorReadings}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={16}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `${value}°`}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Area
            dataKey="outdoor"
            type="monotone"
            connectNulls
            fill="var(--color-outdoor)"
            fillOpacity={0.2}
            stroke="var(--color-outdoor)"
            strokeWidth={2}
            hide={legend.isHidden("outdoor")}
          />
          <Area
            dataKey="indoor"
            type="monotone"
            fill="var(--color-indoor)"
            fillOpacity={0.3}
            stroke="var(--color-indoor)"
            strokeWidth={2}
            hide={legend.isHidden("indoor")}
          />
        </AreaChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(sensorConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
