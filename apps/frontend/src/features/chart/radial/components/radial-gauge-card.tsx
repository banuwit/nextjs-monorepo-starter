"use client";

import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartCard } from "@/components/chart-card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { storageUsage } from "@/mocks/chart.mock";

const storageConfig = {
  used: { label: "Used", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function RadialGaugeCard() {
  const percent = Math.round((storageUsage.used / storageUsage.total) * 100);

  return (
    <ChartCard
      title="Storage"
      description="Single-value gauge with a center label"
      footer={`${storageUsage.used} GB of ${storageUsage.total} GB used.`}
    >
      <ChartContainer
        config={storageConfig}
        className="mx-auto aspect-square h-60"
      >
        <RadialBarChart
          data={[{ name: "used", used: percent }]}
          startAngle={90}
          endAngle={-270}
          innerRadius="75%"
          outerRadius="100%"
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <RadialBar
            dataKey="used"
            background
            cornerRadius={10}
            fill="var(--color-used)"
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-semibold"
                    >
                      {percent}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Used
                    </tspan>
                  </text>
                );
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </ChartCard>
  );
}
