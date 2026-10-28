"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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
import {
  formatPercent,
  withConversion,
} from "@/features/chart/funnel/utils/funnel";
import { formatCompact } from "@/features/chart/utils/format";
import { checkoutFunnel } from "@/mocks/chart-funnel.mock";

const conversionConfig = {
  value: { label: "Converted", color: "var(--chart-1)" },
  dropOff: { label: "Dropped off", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const checkoutData = withConversion(checkoutFunnel, (row) => row.sessions);

export function FunnelConversionCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Checkout conversion"
      description="Conversion rate — stacked drop-off with % kept per step"
      footer="Labels show the share of sessions kept from the previous step."
    >
      <ChartContainer
        config={conversionConfig}
        className="aspect-auto h-64 w-full"
      >
        <BarChart
          data={checkoutData}
          accessibilityLayer
          margin={{ top: 20, left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval={0}
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCompact(Number(value))}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            dataKey="value"
            stackId="funnel"
            fill="var(--color-value)"
            radius={legend.isHidden("dropOff") ? 4 : [0, 0, 4, 4]}
            hide={legend.isHidden("value")}
          >
            {legend.isHidden("dropOff") && (
              <LabelList
                dataKey="stepRate"
                position="top"
                className="fill-foreground"
                fontSize={11}
                formatter={(value) => formatPercent(Number(value), 0)}
              />
            )}
          </Bar>
          <Bar
            dataKey="dropOff"
            stackId="funnel"
            fill="var(--color-dropOff)"
            fillOpacity={0.25}
            radius={[4, 4, 0, 0]}
            hide={legend.isHidden("dropOff")}
          >
            <LabelList
              dataKey="stepRate"
              position="top"
              className="fill-foreground"
              fontSize={11}
              formatter={(value) => formatPercent(Number(value), 0)}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(conversionConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
