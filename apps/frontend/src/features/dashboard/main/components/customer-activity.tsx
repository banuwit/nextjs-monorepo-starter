"use client";

import { useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import {
  Card,
  CardAction,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { numberCompact } from "@/features/dashboard/utils/format";
import { customerActivity } from "@/mocks/dashboard-main.mock";

const chartConfig = {
  activeAccounts: { label: "Active accounts", color: "var(--chart-1)" },
  returningUsers: { label: "Returning users", color: "var(--chart-2)" },
  newCustomers: { label: "New sign-ups", color: "var(--chart-3)" },
} satisfies ChartConfig;

const ranges = [
  { value: "30", label: "30 days", points: 10 },
  { value: "90", label: "90 days", points: customerActivity.length },
] as const;

const tickDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function CustomerActivity() {
  const [range, setRange] = useState<(typeof ranges)[number]["value"]>("90");
  const points = ranges.find((item) => item.value === range)!.points;
  const data = customerActivity.slice(-points);

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Customer activity</CardTitle>
        <CardDescription>
          Daily active accounts, returning users, and new sign-ups
        </CardDescription>
        <CardAction>
          <ToggleGroup
            aria-label="Activity range"
            variant="outline"
            size="sm"
            spacing={0}
            value={[range]}
            onValueChange={(values) => {
              const next = ranges.find((item) => item.value === values[0]);
              if (next) setRange(next.value);
            }}
          >
            {ranges.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value}>
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-80 w-full flex-1"
          role="img"
          aria-label={`Customer activity for the last ${range} days`}
        >
          <ComposedChart data={data} accessibilityLayer margin={{ left: 0, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="main-new-customers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-newCustomers)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-newCustomers)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              minTickGap={28}
              tickMargin={8}
              tickFormatter={(value: string) => tickDate.format(new Date(`${value}T00:00:00Z`))}
            />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value: number) => numberCompact.format(value)}
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)" }}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) =>
                    typeof value === "string"
                      ? tickDate.format(new Date(`${value}T00:00:00Z`))
                      : value
                  }
                />
              }
            />
            <Line
              type="monotone"
              dataKey="activeAccounts"
              stroke="var(--color-activeAccounts)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="returningUsers"
              stroke="var(--color-returningUsers)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="newCustomers"
              stroke="var(--color-newCustomers)"
              fill="url(#main-new-customers)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
