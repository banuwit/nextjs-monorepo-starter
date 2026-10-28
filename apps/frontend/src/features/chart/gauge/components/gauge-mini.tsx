"use client";

import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

const resourceConfig = {
  value: { label: "Usage", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function GaugeMini({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  const fill = value > 80 ? "var(--destructive)" : "var(--color-value)";

  return (
    <div className="flex flex-col items-center gap-1">
      <ChartContainer
        config={resourceConfig}
        className="aspect-auto h-20 w-full max-w-36"
      >
        <RadialBarChart
          data={[{ name: label, value }]}
          startAngle={180}
          endAngle={0}
          cy={76}
          innerRadius={50}
          outerRadius={66}
          barSize={12}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <RadialBar dataKey="value" background cornerRadius={6} fill={fill} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                return (
                  <text
                    x={viewBox.cx}
                    y={(viewBox.cy ?? 0) - 4}
                    textAnchor="middle"
                    className="fill-foreground text-lg font-semibold"
                  >
                    {value}%
                  </text>
                );
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      <div className="text-center">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{detail}</div>
      </div>
    </div>
  );
}
