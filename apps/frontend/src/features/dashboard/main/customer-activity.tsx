"use client";

import { useMemo, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customerActivity } from "@/mocks/dashboard-main.mock";

const chartConfig = {
  newCustomers: { label: "New Customers", color: "var(--chart-1)" },
  activeAccounts: { label: "Active Accounts", color: "var(--chart-2)" },
  returningUsers: { label: "Returning Users", color: "var(--chart-3)" },
} satisfies ChartConfig;

const periods = [
  { value: "3", label: "3 months" },
  { value: "1", label: "1 month" },
];
const segments = [
  { value: "all", label: "All segments" },
  { value: "paid", label: "Paid" },
  { value: "organic", label: "Organic" },
];

export function CustomerActivity() {
  const [period, setPeriod] = useState("3");
  const [segment, setSegment] = useState("all");
  const data = useMemo(() => {
    const points = period === "1" ? customerActivity.slice(-10) : customerActivity;
    const factor = segment === "paid" ? 0.62 : segment === "organic" ? 0.38 : 1;
    return points.map((point) => ({
      ...point,
      newCustomers: Math.round(point.newCustomers * factor),
      activeAccounts: Math.round(point.activeAccounts * factor),
      returningUsers: Math.round(point.returningUsers * factor),
    }));
  }, [period, segment]);

  return (
    <Card>
      <CardHeader className="gap-3 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-1">
          <CardTitle>Customer Activity</CardTitle>
          <CardDescription>Customer activity for the last {period === "1" ? "month" : "3 months"}</CardDescription>
        </div>
        <CardAction className="col-auto row-auto flex flex-wrap items-center gap-2 md:col-start-2 md:row-start-1">
          <Select value={period} onValueChange={(value) => setPeriod(value ?? "3")} items={periods}>
            <SelectTrigger size="sm" aria-label="Activity period" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent><SelectGroup>
              {periods.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectGroup></SelectContent>
          </Select>
          <Select value={segment} onValueChange={(value) => setSegment(value ?? "all")} items={segments}>
            <SelectTrigger size="sm" aria-label="Customer segment" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent><SelectGroup>
              {segments.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectGroup></SelectContent>
          </Select>
          <a className={buttonVariants({ variant: "outline", size: "sm" })} href="#customers">View report</a>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-80 w-full" role="img" aria-label="Customer activity chart showing new customers, active accounts, and returning users">
          <ComposedChart data={data} accessibilityLayer>
            <defs>
              <linearGradient id="customerActivityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-newCustomers)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-newCustomers)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.5} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={32} tickMargin={8} tickFormatter={(value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })} />
            <YAxis hide domain={[0, "auto"]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area type="monotone" dataKey="newCustomers" stroke="var(--color-newCustomers)" fill="url(#customerActivityFill)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="activeAccounts" stroke="var(--color-activeAccounts)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="returningUsers" stroke="var(--color-returningUsers)" strokeWidth={2} dot={false} />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
