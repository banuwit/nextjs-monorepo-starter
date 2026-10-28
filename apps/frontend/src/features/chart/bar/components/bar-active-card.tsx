"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sumBy } from "@/features/chart/utils/format";
import { weeklyOrders } from "@/mocks/chart-bar.mock";

const ordersConfig = {
  orders: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig;

const dayNames: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const peakOrders = weeklyOrders.reduce((peak, row) =>
  row.orders > peak.orders ? row : peak,
);

export function BarActiveCard() {
  return (
    <ChartCard
      title="Orders this week"
      description="Active — one highlighted bar (the peak day) via Cell styling"
      value={sumBy(weeklyOrders, (row) => row.orders).toLocaleString("en-US")}
      change={6.1}
      footer={`${dayNames[peakOrders.day]} was the busiest day with ${peakOrders.orders} orders.`}
    >
      <ChartContainer config={ordersConfig} className="h-64 w-full">
        <BarChart
          data={weeklyOrders}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => dayNames[String(value)] ?? value}
              />
            }
          />
          <Bar dataKey="orders" radius={6}>
            {weeklyOrders.map((row) => {
              const active = row.day === peakOrders.day;
              return (
                <Cell
                  key={row.day}
                  fill={active ? "var(--chart-7)" : "var(--color-orders)"}
                  fillOpacity={active ? 1 : 0.6}
                  stroke={active ? "var(--foreground)" : undefined}
                  strokeWidth={active ? 2 : 0}
                  strokeDasharray={active ? "4 4" : undefined}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
