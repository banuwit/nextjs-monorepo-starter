"use client";

import { useState } from "react";
import { Label, Pie, PieChart, Sector } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
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
import { monthlySignups } from "@/mocks/chart-pie.mock";

const signupConfig = {
  signups: { label: "Sign-ups" },
  january: { label: "January", color: "var(--chart-1)" },
  february: { label: "February", color: "var(--chart-2)" },
  march: { label: "March", color: "var(--chart-3)" },
  april: { label: "April", color: "var(--chart-4)" },
  may: { label: "May", color: "var(--chart-5)" },
} satisfies ChartConfig;

const signupData = monthlySignups.map((item) => ({
  ...item,
  fill: `var(--color-${item.month})`,
}));

const monthOptions = monthlySignups.map((item) => ({
  value: item.month,
  label: item.label,
}));

/** Donut driven by a Select: the chosen month is highlighted and shown in the center. */
export function PieInteractiveCard() {
  const legend = useChartLegendToggle();
  const [activeMonth, setActiveMonth] = useState(
    monthlySignups[0]?.month ?? "january",
  );
  const visible = signupData.filter((item) => !legend.isHidden(item.month));
  const active = signupData.find((item) => item.month === activeMonth);

  return (
    <ChartCard
      title="Monthly sign-ups"
      description="Interactive — pick a month to highlight its slice"
      action={
        <Select
          value={activeMonth}
          items={monthOptions}
          onValueChange={(value) => {
            if (value) setActiveMonth(value);
          }}
        >
          <SelectTrigger size="sm" aria-label="Month" className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" alignItemWithTrigger={false}>
            <SelectGroup>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      }
    >
      <ChartContainer
        config={signupConfig}
        className="mx-auto aspect-square h-64"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="month" hideLabel />}
          />
          <Pie
            data={visible}
            dataKey="signups"
            nameKey="month"
            innerRadius={60}
            outerRadius={80}
            strokeWidth={4}
            shape={({ outerRadius = 0, ...props }) =>
              props.payload?.month === activeMonth ? (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 8} />
                  <Sector
                    {...props}
                    innerRadius={outerRadius + 12}
                    outerRadius={outerRadius + 20}
                  />
                </g>
              ) : (
                <Sector {...props} outerRadius={outerRadius} />
              )
            }
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-semibold"
                    >
                      {active?.signups.toLocaleString("en-US")}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {active?.label}
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(signupConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
