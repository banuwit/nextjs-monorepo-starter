"use client";

import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart } from "recharts";

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
import { deviceUptime } from "@/mocks/chart-radial.mock";

const uptimeConfig = {
  uptime: { label: "Uptime" },
  servers: { label: "Servers", color: "var(--chart-2)" },
  routers: { label: "Routers", color: "var(--chart-3)" },
  storage: { label: "Storage", color: "var(--chart-4)" },
  sensors: { label: "Sensors", color: "var(--chart-6)" },
} satisfies ChartConfig;

const uptimeData = deviceUptime.map((item) => ({
  ...item,
  fill: `var(--color-${item.device})`,
}));

/** Bars drawn over a circular polar grid. */
export function RadialGridCard() {
  const legend = useChartLegendToggle();
  const visible = uptimeData.filter((item) => !legend.isHidden(item.device));

  return (
    <ChartCard
      title="Device uptime"
      description="Grid — bars over a circular polar grid"
    >
      <ChartContainer
        config={uptimeConfig}
        className="mx-auto aspect-square h-60"
      >
        <RadialBarChart data={visible} innerRadius="25%" outerRadius="95%">
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                nameKey="device"
                indicator="line"
                hideLabel
              />
            }
          />
          <PolarGrid gridType="circle" />
          <RadialBar dataKey="uptime" cornerRadius={6} />
        </RadialBarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(uptimeConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
