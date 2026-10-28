"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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
import { vendorComparison } from "@/mocks/chart-radar.mock";

const vendorConfig = {
  vendorA: { label: "Vendor A", color: "var(--chart-2)" },
  vendorB: { label: "Vendor B", color: "var(--chart-4)" },
} satisfies ChartConfig;

/** Two series with a visible radius axis showing the scale. */
export function RadarRadiusAxisCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Vendor evaluation"
      description="Radius axis — scale ticks drawn along one angle"
    >
      <ChartContainer
        config={vendorConfig}
        className="mx-auto aspect-auto h-64 w-full max-w-md"
      >
        <RadarChart data={vendorComparison} outerRadius="70%">
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value, name) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {vendorConfig[name as keyof typeof vendorConfig]?.label ??
                        name}
                    </span>
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {value}
                      <span className="text-muted-foreground"> pts</span>
                    </span>
                  </div>
                )}
              />
            }
          />
          <PolarGrid />
          <PolarAngleAxis dataKey="criterion" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis
            angle={60}
            domain={[0, 100]}
            tickCount={5}
            orientation="middle"
            axisLine={false}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          />
          <Radar
            dataKey="vendorA"
            fill="var(--color-vendorA)"
            fillOpacity={0.3}
            stroke="var(--color-vendorA)"
            hide={legend.isHidden("vendorA")}
          />
          <Radar
            dataKey="vendorB"
            fill="var(--color-vendorB)"
            fillOpacity={0.3}
            stroke="var(--color-vendorB)"
            hide={legend.isHidden("vendorB")}
          />
        </RadarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(vendorConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
