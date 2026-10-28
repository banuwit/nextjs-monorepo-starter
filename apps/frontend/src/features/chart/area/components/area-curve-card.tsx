"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard, ChartPeriodTabs } from "@/components/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sumBy } from "@/features/chart/utils/format";
import { hourlyRequests } from "@/mocks/chart-area.mock";

const requestsConfig = {
  requests: { label: "Requests (K)", color: "var(--chart-3)" },
} satisfies ChartConfig;

const curves = [
  { value: "monotone", label: "Monotone" },
  { value: "natural", label: "Natural" },
  { value: "basis", label: "Basis" },
] as const;

type Curve = (typeof curves)[number]["value"];

const curveNotes: Record<Curve, string> = {
  monotone: "monotone passes through every point and never overshoots it.",
  natural: "natural passes through every point but may overshoot between them.",
  basis: "basis smooths the most and does not pass through the points.",
};

export function AreaCurveCard() {
  const [curve, setCurve] = useState<Curve>("monotone");

  return (
    <ChartCard
      title="Hourly requests"
      description="Curve — compare the monotone, natural and basis interpolation types"
      className="@4xl/main:col-span-2"
      value={`${sumBy(hourlyRequests, (row) => row.requests)}K`}
      change={5.6}
      footer={`The dots are the raw values: ${curveNotes[curve]}`}
    >
      {/* Tabs live in the body: the long labels would squeeze the title on mobile. */}
      <div className="pb-4">
        <ChartPeriodTabs
          label="Curve type"
          value={curve}
          options={curves}
          onValueChange={setCurve}
        />
      </div>
      <ChartContainer config={requestsConfig} className="h-64 w-full">
        <AreaChart
          data={hourlyRequests}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={16}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Area
            dataKey="requests"
            type={curve}
            fill="var(--color-requests)"
            fillOpacity={0.25}
            stroke="var(--color-requests)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--color-requests)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
