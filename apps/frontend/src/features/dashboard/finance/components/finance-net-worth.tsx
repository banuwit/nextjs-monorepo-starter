"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendDelta } from "@/features/dashboard/components/trend-delta";
import { percentChange, usdCompact, usdWhole } from "@/features/dashboard/utils/format";
import { financeNetWorthHistory } from "@/mocks/dashboard-finance.mock";

const chartConfig = {
  netWorth: { label: "Net worth", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function FinanceNetWorth({ today }: { today: string }) {
  const current = new Date(today);
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
  const data = financeNetWorthHistory.map((netWorth, index) => ({
    month: month.format(
      new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() - 11 + index, 1)),
    ),
    netWorth,
  }));
  const latest = financeNetWorthHistory.at(-1)!;
  const previous = financeNetWorthHistory.at(-2)!;
  const yearAgo = financeNetWorthHistory[0]!;
  const monthly = percentChange(latest, previous)!;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Net worth</CardTitle>
        <CardDescription>All accounts, month-end balances</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <p className="text-4xl font-semibold tracking-tight">{usdWhole.format(latest)}</p>
          <p className="flex flex-wrap items-center gap-x-1.5 pb-1 text-sm text-muted-foreground">
            <TrendDelta delta={{ ...monthly, sentiment: "good" }} className="text-sm" />
            <span>
              {usdWhole.format(latest - previous)} this month,{" "}
              {usdWhole.format(latest - yearAgo)} over 12 months
            </span>
          </p>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-56 w-full flex-1"
          role="img"
          aria-label={`Net worth over the last 12 months, from ${usdWhole.format(yearAgo)} to ${usdWhole.format(latest)}`}
        >
          <AreaChart data={data} accessibilityLayer margin={{ left: 4, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="finance-net-worth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-netWorth)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-netWorth)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              width={52}
              tickLine={false}
              axisLine={false}
              domain={[80_000, 140_000]}
              ticks={[80_000, 100_000, 120_000, 140_000]}
              tickFormatter={(value: number) => usdCompact.format(value)}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)" }}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => (
                    <span className="font-medium tabular-nums">
                      {usdWhole.format(Number(value))}
                    </span>
                  )}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke="var(--color-netWorth)"
              fill="url(#finance-net-worth)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
