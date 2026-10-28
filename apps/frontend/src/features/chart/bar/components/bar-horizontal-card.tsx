"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCompact } from "@/features/chart/utils/format";
import { trafficChannels } from "@/mocks/chart.mock";

const channelConfig = {
  visitors: { label: "Visitors", color: "var(--chart-2)" },
} satisfies ChartConfig;

const channelColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-6)",
];

const channelData = trafficChannels.map((item, index) => ({
  ...item,
  fill: channelColors[index % channelColors.length],
}));

export function BarHorizontalCard() {
  const legend = useChartLegendToggle();
  const visible = channelData.filter((item) => !legend.isHidden(item.channel));

  return (
    <ChartCard
      title="Top channels"
      description="Horizontal bar with value labels; toggle channels in the legend"
      footer="Organic search remains the largest source of visitors."
    >
      <ChartContainer config={channelConfig} className="h-64 w-full">
        <BarChart
          data={visible}
          layout="vertical"
          accessibilityLayer
          margin={{ left: 0, right: 40 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="channel"
            type="category"
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <XAxis dataKey="visitors" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="visitors" radius={4}>
            {visible.map((item) => (
              <Cell key={item.channel} fill={item.fill} />
            ))}
            <LabelList
              dataKey="visitors"
              position="right"
              className="fill-foreground"
              fontSize={12}
              formatter={(value) => formatCompact(Number(value))}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={channelData.map((item) => ({
          key: item.channel,
          label: item.channel,
          color: item.fill ?? "",
        }))}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
