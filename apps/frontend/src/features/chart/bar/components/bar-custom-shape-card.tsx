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

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarTriangleShape } from "@/features/chart/bar/components/bar-triangle-shape";
import { formatCompact, sumBy } from "../utils/format";
import { featureAdoption } from "@/mocks/chart-bar.mock";

const adoptionConfig = {
  users: { label: "Active users", color: "var(--chart-2)" },
} satisfies ChartConfig;

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-6)",
];

export function BarCustomShapeCard() {
  return (
    <ChartCard
      title="Feature adoption"
      description="Custom shape — the Bar `shape` prop renders a curved triangle"
      value={formatCompact(sumBy(featureAdoption, (row) => row.users))}
      change={12.4}
      footer="Active users per feature in the last 30 days."
    >
      <ChartContainer config={adoptionConfig} className="h-64 w-full">
        <BarChart
          data={featureAdoption}
          accessibilityLayer
          margin={{ top: 20, left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="feature"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideIndicator />}
          />
          <Bar dataKey="users" shape={BarTriangleShape}>
            {featureAdoption.map((row, index) => (
              <Cell key={row.feature} fill={colors[index % colors.length]} />
            ))}
            <LabelList
              dataKey="users"
              position="top"
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
