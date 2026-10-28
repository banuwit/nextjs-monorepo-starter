"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { fulfillmentTarget } from "@/mocks/chart-composed.mock";

const targetConfig = {
  hours: { label: "Fulfillment (h)", color: "var(--chart-3)" },
  average: { label: "3-week average", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function ComposedTargetBandCard() {
  const legend = useChartLegendToggle();
  const { min, max, data } = fulfillmentTarget;
  const last = data[data.length - 1];

  return (
    <ChartCard
      title="Order fulfillment"
      description={`Target band — ReferenceArea for the ${min}–${max} h goal behind bars and a line`}
      value={last ? `${last.hours} h` : undefined}
      change={-13.8}
      footer="Fulfillment entered the target band in week 3."
    >
      <ChartContainer config={targetConfig} className="h-64 w-full">
        <ComposedChart
          data={data}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} domain={[0, 48]} />
          <ReferenceArea
            y1={min}
            y2={max}
            fill="var(--muted-foreground)"
            fillOpacity={0.12}
            stroke="var(--foreground)"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
            ifOverflow="extendDomain"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="hours"
            fill="var(--color-hours)"
            radius={4}
            maxBarSize={28}
            hide={legend.isHidden("hours")}
          />
          <Line
            dataKey="average"
            type="monotone"
            stroke="var(--color-average)"
            strokeWidth={2}
            dot={false}
            hide={legend.isHidden("average")}
          />
        </ComposedChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(targetConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
