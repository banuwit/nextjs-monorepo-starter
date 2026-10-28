"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
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
import { revenueConversion } from "@/mocks/chart-composed.mock";

const biaxialConfig = {
  revenue: { label: "Revenue ($K)", color: "var(--chart-2)" },
  conversion: { label: "Conversion (%)", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function ComposedBiaxialCard() {
  const legend = useChartLegendToggle();
  const last = revenueConversion[revenueConversion.length - 1];

  return (
    <ChartCard
      title="Revenue & conversion"
      description="Biaxial — bars on the left axis, % line on the right"
      value={last ? `${last.conversion}%` : undefined}
      change={8.3}
      footer="Conversion rate (right axis) rises together with revenue (left axis)."
    >
      <ChartContainer config={biaxialConfig} className="h-64 w-full">
        <ComposedChart
          data={revenueConversion}
          accessibilityLayer
          margin={{ left: -20, right: -20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis yAxisId="left" tickLine={false} axisLine={false} />
          <YAxis
            yAxisId="right"
            orientation="right"
            unit="%"
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill="var(--color-revenue)"
            radius={4}
            maxBarSize={36}
            hide={legend.isHidden("revenue")}
          />
          <Line
            yAxisId="right"
            dataKey="conversion"
            type="monotone"
            stroke="var(--color-conversion)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--color-conversion)" }}
            hide={legend.isHidden("conversion")}
          />
        </ComposedChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(biaxialConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
