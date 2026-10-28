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
import { cn } from "cn";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCurrency, sumBy } from "@/features/chart/utils/format";
import { monthlyNetIncome } from "@/mocks/chart-bar.mock";

const netConfig = {
  net: { label: "Net income", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function BarNegativeCard() {
  const net = sumBy(monthlyNetIncome, (row) => row.net);

  return (
    <ChartCard
      title="Net income"
      description="Negative — Cell color by sign, losses in the destructive color (in $K)"
      value={`$${net}K`}
      change={-3.4}
      footer="The tooltip formatter adds the sign and currency."
    >
      <ChartContainer config={netConfig} className="h-64 w-full">
        <BarChart
          data={monthlyNetIncome}
          accessibilityLayer
          margin={{ top: 20, left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideIndicator
                formatter={(value) => {
                  const amount = Number(value);
                  return (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">Net income</span>
                      <span
                        className={cn(
                          "font-mono font-medium tabular-nums",
                          amount < 0 ? "text-destructive" : "text-foreground",
                        )}
                      >
                        {amount > 0 ? "+" : ""}
                        {formatCurrency(amount * 1000)}
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
          <Bar dataKey="net" radius={4}>
            {monthlyNetIncome.map((row) => (
              <Cell
                key={row.month}
                fill={row.net < 0 ? "var(--destructive)" : "var(--color-net)"}
              />
            ))}
            <LabelList
              dataKey="net"
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
