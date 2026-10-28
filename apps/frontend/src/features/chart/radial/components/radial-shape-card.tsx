"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { monthlyActiveUsers } from "@/mocks/chart-radial.mock";

const usersConfig = {
  users: { label: "Active users", color: "var(--chart-4)" },
} satisfies ChartConfig;

/** Single bar whose sweep is set by the chart angles, on a custom ring. */
export function RadialShapeCard() {
  const ratio = monthlyActiveUsers.users / monthlyActiveUsers.goal;

  return (
    <ChartCard
      title="Monthly active users"
      description="Shape — custom background ring drawn with PolarGrid"
      footer={`${Math.round(ratio * 100)}% of the ${monthlyActiveUsers.goal.toLocaleString("en-US")} user goal.`}
    >
      <ChartContainer
        config={usersConfig}
        className="mx-auto aspect-square h-60"
      >
        <RadialBarChart
          data={[{ name: "users", users: monthlyActiveUsers.users }]}
          startAngle={90}
          endAngle={90 - 360 * ratio}
          innerRadius={70}
          outerRadius={100}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[90, 80]}
          />
          <RadialBar
            dataKey="users"
            background
            cornerRadius={10}
            fill="var(--color-users)"
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
                      {monthlyActiveUsers.users.toLocaleString("en-US")}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Active users
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
