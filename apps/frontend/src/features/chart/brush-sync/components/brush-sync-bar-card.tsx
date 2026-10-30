"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
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
import type { BrushRange } from "@/features/chart/brush-sync/types/brush-sync";
import {
  brushStyle,
  formatDay,
  lastRange,
  sliceRange,
} from "@/features/chart/brush-sync/utils/brush-sync";
import { sumBy } from "../utils/format";
import { dailyStockMoves } from "@/mocks/chart-brush-sync.mock";

const stockConfig = {
  received: { label: "Received", color: "var(--chart-2)" },
  shipped: { label: "Shipped", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function BrushSyncBarCard() {
  const legend = useChartLegendToggle();
  const [range, setRange] = useState<BrushRange>(() =>
    lastRange(dailyStockMoves.length, 21),
  );
  const visible = sliceRange(dailyStockMoves, range);
  const net = sumBy(
    visible,
    (row) =>
      (legend.isHidden("received") ? 0 : row.received) +
      (legend.isHidden("shipped") ? 0 : row.shipped),
  );

  return (
    <ChartCard
      title="Stock movements"
      description="Brush bar chart — positive and negative bars with a brush to scroll through 90 days"
      value={`${net >= 0 ? "+" : ""}${net.toLocaleString("en-US")} units`}
      footer={`Net change for the ${visible.length} days in the brush window.`}
    >
      <ChartContainer config={stockConfig} className="aspect-auto h-72 w-full">
        <BarChart
          data={dailyStockMoves}
          stackOffset="sign"
          accessibilityLayer
          margin={{ left: -16, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            tickFormatter={(value: string) => formatDay(value)}
          />
          <YAxis tickLine={false} axisLine={false} width={48} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) => formatDay(String(value), "long")}
              />
            }
          />
          <ReferenceLine y={0} stroke="var(--border)" />
          <Bar
            dataKey="received"
            stackId="moves"
            fill="var(--color-received)"
            radius={[3, 3, 0, 0]}
            hide={legend.isHidden("received")}
          />
          <Bar
            dataKey="shipped"
            stackId="moves"
            fill="var(--color-shipped)"
            radius={[3, 3, 0, 0]}
            hide={legend.isHidden("shipped")}
          />
          <Brush
            {...brushStyle}
            dataKey="date"
            startIndex={range.startIndex}
            endIndex={range.endIndex}
            tickFormatter={(value: string) => formatDay(value)}
            onChange={(next) => {
              if (
                next.startIndex !== range.startIndex ||
                next.endIndex !== range.endIndex
              ) {
                setRange(next);
              }
            }}
          />
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(stockConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
