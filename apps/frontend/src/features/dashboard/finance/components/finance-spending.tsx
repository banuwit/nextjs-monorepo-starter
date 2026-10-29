"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendDelta } from "./trend-delta";
import { percentChange, usdWhole } from "../utils/format";
import { financeSpending } from "@/mocks/dashboard-finance.mock";

const chartConfig = {
  thisWeek: { label: "This week", color: "var(--chart-1)" },
  lastWeek: { label: "Last week", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

const sum = (key: "thisWeek" | "lastWeek") =>
  financeSpending.reduce((total, day) => total + day[key], 0);

export function FinanceSpending() {
  const thisWeek = sum("thisWeek");
  const lastWeek = sum("lastWeek");
  const change = percentChange(thisWeek, lastWeek)!;
  const peak = financeSpending.reduce((max, day) => (day.thisWeek > max.thisWeek ? day : max));

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Spending</CardTitle>
        <CardDescription>Daily card and account spending</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="flex flex-wrap gap-x-8 gap-y-2">
          <div>
            <dt className="text-xs text-muted-foreground">This week</dt>
            <dd className="flex items-center gap-2">
              <span className="text-xl font-semibold">{usdWhole.format(thisWeek)}</span>
              <TrendDelta delta={{ ...change, sentiment: change.direction === "up" ? "bad" : "good" }} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Daily average</dt>
            <dd className="text-xl font-semibold">{usdWhole.format(thisWeek / 7)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Highest day</dt>
            <dd className="text-xl font-semibold">
              {peak.day}, {usdWhole.format(peak.thisWeek)}
            </dd>
          </div>
        </dl>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-56 w-full"
          role="img"
          aria-label={`Spending this week ${usdWhole.format(thisWeek)} compared with ${usdWhole.format(lastWeek)} last week`}
        >
          <BarChart data={[...financeSpending]} accessibilityLayer margin={{ left: 0, right: 4, top: 8 }} barGap={2}>
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              width={44}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `$${value}`}
            />
            <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
            <Bar dataKey="lastWeek" fill="var(--color-lastWeek)" fillOpacity={0.35} radius={[4, 4, 0, 0]} maxBarSize={20} />
            <Bar dataKey="thisWeek" fill="var(--color-thisWeek)" radius={[4, 4, 0, 0]} maxBarSize={20} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
