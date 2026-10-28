"use client";

import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts";

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
import { nodeResources } from "@/mocks/chart-scatter.mock";

const resourcesConfig = {
  cpu: { label: "CPU (%)", color: "var(--chart-2)" },
  memory: { label: "Memory (GB)", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function ScatterMultipleYAxesCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Node resources"
      description="Multiple Y axes — CPU on the left axis, memory on the right"
      footer="Both resources grow with concurrent users at different scales."
    >
      <ChartContainer config={resourcesConfig} className="h-64 w-full">
        <ScatterChart
          accessibilityLayer
          margin={{ left: -12, right: -12, top: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="users"
            type="number"
            name="Users"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="cpu"
            dataKey="cpu"
            type="number"
            name="cpu"
            unit="%"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="memory"
            dataKey="memory"
            type="number"
            name="memory"
            orientation="right"
            unit="G"
            tickLine={false}
            axisLine={false}
          />
          <ChartTooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={<ChartTooltipContent hideLabel />}
          />
          <Scatter
            yAxisId="cpu"
            name="cpu"
            data={nodeResources.cpu}
            fill="var(--color-cpu)"
            hide={legend.isHidden("cpu")}
          />
          <Scatter
            yAxisId="memory"
            name="memory"
            data={nodeResources.memory}
            fill="var(--color-memory)"
            shape="diamond"
            hide={legend.isHidden("memory")}
          />
        </ScatterChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(resourcesConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
