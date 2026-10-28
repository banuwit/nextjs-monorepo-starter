"use client";

import {
  CartesianGrid,
  LabelList,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sumBy } from "@/features/chart/utils/format";
import { featureMatrix } from "@/mocks/chart-scatter.mock";

const matrixConfig = {
  usage: { label: "Adoption (%)", color: "var(--chart-4)" },
  satisfaction: { label: "Satisfaction" },
} satisfies ChartConfig;

export function ScatterQuadrantCard() {
  const avgUsage =
    sumBy(featureMatrix, (row) => row.usage) / featureMatrix.length;
  const avgSatisfaction =
    sumBy(featureMatrix, (row) => row.satisfaction) / featureMatrix.length;

  return (
    <ChartCard
      title="Feature matrix"
      description="Quadrant with labels — ReferenceLines at the averages, LabelList names each point"
      footer="Bottom-left features (low adoption, low satisfaction) need attention."
    >
      <ChartContainer config={matrixConfig} className="h-64 w-full">
        <ScatterChart
          accessibilityLayer
          margin={{ left: -20, right: 16, top: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="usage"
            type="number"
            name="usage"
            unit="%"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="satisfaction"
            type="number"
            name="satisfaction"
            domain={[2, 5]}
            tickLine={false}
            axisLine={false}
          />
          <ReferenceLine
            x={avgUsage}
            stroke="var(--foreground)"
            strokeDasharray="5 4"
          />
          <ReferenceLine
            y={avgSatisfaction}
            stroke="var(--foreground)"
            strokeDasharray="5 4"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Scatter name="usage" data={featureMatrix} fill="var(--color-usage)">
            <LabelList
              dataKey="name"
              position="top"
              offset={8}
              className="fill-foreground"
              fontSize={11}
            />
          </Scatter>
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  );
}
