"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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
import { regionOrders } from "@/mocks/chart-radar.mock";

const ordersConfig = {
  online: { label: "Online", color: "var(--chart-2)" },
  store: { label: "In store", color: "var(--chart-4)" },
} satisfies ChartConfig;

/** Each axis label also shows the values of both series. */
export function RadarLabelCustomCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Orders by region"
      description="Label custom — values shown above each axis label"
    >
      <ChartContainer
        config={ordersConfig}
        className="mx-auto aspect-auto h-72 w-full max-w-md"
      >
        <RadarChart data={regionOrders} outerRadius="65%">
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <PolarAngleAxis
            dataKey="region"
            tick={({ x, y, textAnchor, index }) => {
              const row = regionOrders[index];
              const top = Number(y) + (index === 0 ? -12 : 0);
              if (!row) return <g />;
              return (
                <text
                  x={x}
                  y={top}
                  textAnchor={textAnchor}
                  className="fill-foreground text-xs font-medium"
                >
                  <tspan>{row.online}</tspan>
                  <tspan className="fill-muted-foreground"> / </tspan>
                  <tspan>{row.store}</tspan>
                  <tspan
                    x={x}
                    dy="1.1em"
                    className="fill-muted-foreground font-normal"
                  >
                    {row.region}
                  </tspan>
                </text>
              );
            }}
          />
          <PolarGrid />
          <Radar
            dataKey="online"
            fill="var(--color-online)"
            fillOpacity={0.5}
            stroke="var(--color-online)"
            hide={legend.isHidden("online")}
          />
          <Radar
            dataKey="store"
            fill="var(--color-store)"
            fillOpacity={0.5}
            stroke="var(--color-store)"
            hide={legend.isHidden("store")}
          />
        </RadarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(ordersConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
