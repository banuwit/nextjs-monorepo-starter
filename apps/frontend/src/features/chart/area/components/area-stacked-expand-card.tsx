"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { sumBy } from "@/features/chart/utils/format";
import { monthlySessions } from "@/mocks/chart-area.mock";

const sessionsConfig = {
  organic: { label: "Organic", color: "var(--chart-1)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
} satisfies ChartConfig;

type SessionKey = keyof typeof sessionsConfig;

export function AreaStackedExpandCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Session mix"
      description='Stacked expand — stackOffset="expand" shows each source as a share of 100%'
      footer="The tooltip formatter shows the raw value and its share."
    >
      <ChartContainer config={sessionsConfig} className="h-64 w-full">
        <AreaChart
          data={monthlySessions}
          stackOffset="expand"
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
            tickFormatter={(value: number) => `${Math.round(value * 100)}%`}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value, name, item) => {
                  const row = item.payload as (typeof monthlySessions)[number];
                  const keys = (
                    Object.keys(sessionsConfig) as SessionKey[]
                  ).filter((key) => !legend.isHidden(key));
                  const total = sumBy(keys, (key) => row[key]);
                  const key = String(name) as SessionKey;
                  return (
                    <div className="flex w-full items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: `var(--color-${key})` }}
                      />
                      <span className="text-muted-foreground">
                        {sessionsConfig[key]?.label ?? key}
                      </span>
                      <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
                        {Number(value)} ·{" "}
                        {((Number(value) / total) * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                }}
              />
            }
          />
          {(Object.keys(sessionsConfig) as SessionKey[]).map((key) => (
            <Area
              key={key}
              dataKey={key}
              type="natural"
              stackId="sessions"
              fill={`var(--color-${key})`}
              fillOpacity={0.5}
              stroke={`var(--color-${key})`}
              hide={legend.isHidden(key)}
            />
          ))}
        </AreaChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(sessionsConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
