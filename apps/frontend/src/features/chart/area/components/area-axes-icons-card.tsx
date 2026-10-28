"use client";

import { MonitorIcon, SmartphoneIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import { visitorsByPlatform } from "@/mocks/chart-area.mock";

const platformConfig = {
  desktop: { label: "Desktop", color: "var(--chart-2)", icon: MonitorIcon },
  mobile: { label: "Mobile", color: "var(--chart-4)", icon: SmartphoneIcon },
} satisfies ChartConfig;

export function AreaAxesIconsCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Visitors by platform"
      description="Axes & icons — visible Y axis with compact ticks, icons from ChartConfig in the tooltip"
      value={formatCompact(
        sumBy(visitorsByPlatform, (row) => row.desktop + row.mobile),
      )}
      change={-2.3}
    >
      <ChartContainer config={platformConfig} className="h-64 w-full">
        <AreaChart
          data={visitorsByPlatform}
          accessibilityLayer
          margin={{ left: -12, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickCount={4}
            tickFormatter={(value: number) => formatCompact(value)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="mobile"
            type="natural"
            fill="var(--color-mobile)"
            fillOpacity={0.3}
            stroke="var(--color-mobile)"
            hide={legend.isHidden("mobile")}
          />
          <Area
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.3}
            stroke="var(--color-desktop)"
            hide={legend.isHidden("desktop")}
          />
        </AreaChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(platformConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
