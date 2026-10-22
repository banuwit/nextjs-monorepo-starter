"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  financeAllocation,
  financeSpending,
} from "@/mocks/dashboard-finance.mock";

const spendingConfig = {
  weekly: { label: "Spending", color: "var(--chart-1)" },
  monthly: { label: "Spending", color: "var(--chart-1)" },
} satisfies ChartConfig;

const allocationConfig = Object.fromEntries(
  financeAllocation.map((account) => [
    account.label,
    { label: account.label, color: account.fill },
  ]),
) satisfies ChartConfig;

const periods = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function SpendingOverview() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Spending Overview</CardTitle>
        <CardAction>
          <Select
            value={period}
            items={periods}
            onValueChange={(value) =>
              setPeriod(value === "monthly" ? "monthly" : "weekly")
            }
          >
            <SelectTrigger
              size="sm"
              aria-label="Spending period"
              className="w-28"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {periods.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={spendingConfig}
          className="h-50 w-full"
          role="img"
          aria-label={`${period} sample spending by day`}
        >
          <BarChart
            data={financeSpending}
            accessibilityLayer
            margin={{ top: 12, right: 4, left: -24, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickFormatter={(day: string) => day.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `$${value}`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey={period}
              fill={`var(--color-${period})`}
              radius={[5, 5, 0, 0]}
              maxBarSize={44}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function AccountAllocation() {
  const total = financeAllocation.reduce(
    (sum, account) => sum + account.amount,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal">Account Allocation</CardTitle>
        <CardAction>
          <Select value="usd" items={[{ value: "usd", label: "USD Balance" }]}>
            <SelectTrigger
              size="sm"
              aria-label="Balance currency"
              className="w-36"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="usd">USD Balance</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="grid items-center gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <div className="relative mx-auto h-50 w-full max-w-50">
          <ChartContainer
            config={allocationConfig}
            className="aspect-square h-50 w-full"
            role="img"
            aria-label="Sample account allocation: Main Wallet 52.2%, Savings 20.6%, Investment 15.7%, Reserve 11.5%"
          >
            <PieChart accessibilityLayer>
              <Pie
                data={financeAllocation}
                dataKey="amount"
                nameKey="label"
                innerRadius="67%"
                outerRadius="88%"
                strokeWidth={0}
                isAnimationActive={false}
              >
                {financeAllocation.map((account) => (
                  <Cell key={account.label} fill={account.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-xl font-semibold tabular-nums">
              ${total.toLocaleString("en-US")}
            </span>
          </div>
        </div>
        <ul className="flex min-w-0 flex-col gap-3">
          {financeAllocation.map((account) => (
            <li
              key={account.label}
              className="grid grid-cols-[1fr_auto] items-end gap-3 text-sm"
            >
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1">
                  <span
                    className="h-2 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: account.fill }}
                  />
                  <span className="truncate text-xs text-muted-foreground">
                    {account.label}
                  </span>
                </div>
                <div className="font-medium tabular-nums">
                  ${account.amount.toLocaleString("en-US")}
                </div>
              </div>
              <span className="font-medium tabular-nums">{account.share}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
