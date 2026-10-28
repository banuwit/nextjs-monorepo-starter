"use client";

import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { percentOf } from "@/features/chart/gauge/utils/gauge";
import { ARC } from "@/features/chart/gauge/utils/gauge-config";
import { apiQuota } from "@/mocks/chart-gauge.mock";

const quotaConfig = {
  used: { label: "Used", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function GaugeProgressCard() {
  const percent = percentOf(apiQuota.used, apiQuota.limit);

  return (
    <ChartCard
      title="API quota"
      description="Semicircle progress — radial bar with a center value"
      footer={`${apiQuota.used.toLocaleString("en-US")} of ${apiQuota.limit.toLocaleString("en-US")} requests this month.`}
    >
      <ChartContainer
        config={quotaConfig}
        className="mx-auto aspect-auto h-40 w-full max-w-72"
      >
        <RadialBarChart
          data={[{ name: "used", used: percent }]}
          startAngle={ARC.startAngle}
          endAngle={ARC.endAngle}
          cy={ARC.cy}
          innerRadius={ARC.inner}
          outerRadius={ARC.outer}
          barSize={28}
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
            cornerRadius={8}
            fill="var(--color-used)"
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) - 24}
                      className="fill-foreground text-3xl font-semibold"
                    >
                      {percent}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) - 4}
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
