"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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
import { productRevenue } from "@/mocks/chart-bar.mock";

/** Locale-independent "$48.2K" so server and client render the same text. */
function formatThousands(value: number) {
  return `$${(value / 1000).toFixed(1)}K`;
}

const productConfig = {
  revenue: { label: "Revenue", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function BarLabelCustomCard() {
  return (
    <ChartCard
      title="Revenue by product"
      description="Label custom — category labels inside horizontal bars, values outside"
      value={formatThousands(sumBy(productRevenue, (row) => row.revenue))}
      change={9.7}
    >
      <ChartContainer config={productConfig} className="h-64 w-full">
        <BarChart
          data={productRevenue}
          layout="vertical"
          accessibilityLayer
          margin={{ left: 0, right: 48 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis dataKey="product" type="category" hide />
          <XAxis dataKey="revenue" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4}>
            <LabelList
              dataKey="product"
              position="insideLeft"
              offset={8}
              className="fill-white"
              fontSize={12}
            />
            <LabelList
              dataKey="revenue"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
              formatter={(value) => formatThousands(Number(value))}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
