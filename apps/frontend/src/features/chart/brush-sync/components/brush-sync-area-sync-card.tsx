"use client";

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
import { formatDay } from "@/features/chart/brush-sync/utils/brush-sync";
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import {
  dailyPlatformVisitors,
  weekdayOrders,
} from "@/mocks/chart-brush-sync.mock";

const visitorsConfig = {
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  mobile: { label: "Mobile", color: "var(--chart-4)" },
} satisfies ChartConfig;

const ordersConfig = {
  orders: { label: "Orders", color: "var(--chart-1)" },
} satisfies ChartConfig;

const SYNC_ID = "brush-sync-traffic";

const xAxisProps = {
  dataKey: "date",
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  minTickGap: 32,
  tickFormatter: (value: string) => formatDay(value),
} as const;

const tooltip = (
  <ChartTooltip
    content={
      <ChartTooltipContent
        indicator="dot"
        labelFormatter={(value) => formatDay(String(value), "long")}
      />
    }
  />
);

export function BrushSyncAreaSyncCard() {
  const legend = useChartLegendToggle();
  const totalOrders = sumBy(weekdayOrders, (row) => row.orders);

  return (
    <ChartCard
      title="Traffic and orders"
      description='Synchronized area — two area charts share a syncId with syncMethod="value", matching by date'
      value={`${formatCompact(totalOrders)} orders`}
      footer="Orders exist on weekdays only, so the rows match by date value, not by index."
    >
      <ChartContainer
        config={visitorsConfig}
        className="aspect-auto h-40 w-full"
      >
        <AreaChart
          data={dailyPlatformVisitors}
          syncId={SYNC_ID}
          syncMethod="value"
          accessibilityLayer
          margin={{ top: 4, left: -8, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis {...xAxisProps} hide />
          <YAxis tickLine={false} axisLine={false} width={48} tickCount={3} />
          {tooltip}
          <Area
            dataKey="mobile"
            type="monotone"
            stackId="visitors"
            fill="var(--color-mobile)"
            fillOpacity={0.25}
            stroke="var(--color-mobile)"
            hide={legend.isHidden("mobile")}
          />
          <Area
            dataKey="desktop"
            type="monotone"
            stackId="visitors"
            fill="var(--color-desktop)"
            fillOpacity={0.25}
            stroke="var(--color-desktop)"
            hide={legend.isHidden("desktop")}
          />
        </AreaChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(visitorsConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
        className="pt-1 pb-2"
      />
      <ChartContainer config={ordersConfig} className="aspect-auto h-32 w-full">
        <AreaChart
          data={weekdayOrders}
          syncId={SYNC_ID}
          syncMethod="value"
          accessibilityLayer
          margin={{ top: 4, left: -8, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis {...xAxisProps} />
          <YAxis tickLine={false} axisLine={false} width={48} tickCount={3} />
          {tooltip}
          <Area
            dataKey="orders"
            type="monotone"
            fill="var(--color-orders)"
            fillOpacity={0.25}
            stroke="var(--color-orders)"
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
