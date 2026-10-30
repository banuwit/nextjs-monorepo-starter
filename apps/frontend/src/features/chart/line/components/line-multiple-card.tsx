"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCompact, sumBy } from "../utils/format";
import { monthlyActiveUsers } from "@/mocks/chart-line.mock";

const activeUsersConfig = {
  web: { label: "Web", color: "var(--chart-2)" },
  ios: { label: "iOS", color: "var(--chart-4)" },
  android: { label: "Android", color: "var(--chart-1)" },
} satisfies ChartConfig;

type ActiveUserKey = keyof typeof activeUsersConfig;

const activeUserKeys = Object.keys(activeUsersConfig) as ActiveUserKey[];

export function LineMultipleCard() {
  const legend = useChartLegendToggle();
  const latest = monthlyActiveUsers[monthlyActiveUsers.length - 1];

  return (
    <ChartCard
      title="Monthly active users"
      description="Multiple — one line per platform, advanced tooltip with a total"
      value={
        latest
          ? formatCompact(sumBy(activeUserKeys, (key) => latest[key]))
          : undefined
      }
      change={7.9}
      footer="The tooltip uses formatter for rows and labelFormatter for the total."
    >
      <ChartContainer config={activeUsersConfig} className="h-64 w-full">
        <LineChart
          data={monthlyActiveUsers}
          accessibilityLayer
          margin={{ left: -12, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatCompact(value)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                className="w-48"
                labelFormatter={(value, payload) => {
                  const total = sumBy(payload, (item) => Number(item.value));
                  return (
                    <div className="flex items-center justify-between gap-4">
                      <span>{value}</span>
                      <span className="font-mono text-muted-foreground tabular-nums">
                        Total {total.toLocaleString("en-US")}
                      </span>
                    </div>
                  );
                }}
                formatter={(value, name) => {
                  const key = String(name) as ActiveUserKey;
                  return (
                    <div className="flex w-full items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: `var(--color-${key})` }}
                      />
                      <span className="text-muted-foreground">
                        {activeUsersConfig[key]?.label ?? key}
                      </span>
                      <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
                        {Number(value).toLocaleString("en-US")}
                        <span className="ml-0.5 font-normal text-muted-foreground">
                          users
                        </span>
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
          {activeUserKeys.map((key) => (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              dot={false}
              hide={legend.isHidden(key)}
            />
          ))}
        </LineChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(activeUsersConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
