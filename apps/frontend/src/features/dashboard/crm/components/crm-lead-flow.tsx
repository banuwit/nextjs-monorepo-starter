"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { crmLeadFlow } from "@/mocks/dashboard-crm.mock";

import { summarizeCrmLeadFlow } from "../utils/crm-data";

const chartConfig = {
  booked: { label: "Booked a call", color: "var(--chart-1)" },
  waiting: { label: "Not yet booked", color: "var(--chart-2)" },
} satisfies ChartConfig;

const ranges = ["12", "6", "3"] as const;

export function CrmLeadFlow() {
  const [range, setRange] = useState<(typeof ranges)[number]>("12");
  const points = crmLeadFlow.slice(-Number(range));
  const { qualified, booked, bookingRate } = summarizeCrmLeadFlow(points);
  // Stacked so each bar's full height is the month's qualified leads.
  const data = points.map((point) => ({
    month: point.month,
    booked: point.booked,
    waiting: point.qualified - point.booked,
  }));

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Qualified leads</CardTitle>
        <CardDescription>Monthly leads, split by whether they booked a first call</CardDescription>
        <CardAction>
          <ToggleGroup
            aria-label="Lead flow range"
            variant="outline"
            size="sm"
            spacing={0}
            value={[range]}
            onValueChange={(values) => {
              const next = ranges.find((value) => value === values[0]);
              if (next) setRange(next);
            }}
          >
            {ranges.map((value) => (
              <ToggleGroupItem key={value} value={value}>
                {value}M
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <dl className="flex flex-wrap gap-x-8 gap-y-2">
          <div>
            <dt className="text-xs text-muted-foreground">Qualified leads</dt>
            <dd className="text-xl font-semibold">{qualified}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Discovery calls booked</dt>
            <dd className="text-xl font-semibold">{booked}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Booking rate</dt>
            <dd className="text-xl font-semibold">{bookingRate}%</dd>
          </div>
        </dl>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-60 w-full flex-1"
          role="img"
          aria-label={`${qualified} qualified leads and ${booked} booked calls over the last ${range} months`}
        >
          <BarChart data={data} accessibilityLayer margin={{ left: 0, right: 4, top: 8 }}>
            <CartesianGrid vertical={false} strokeOpacity={0.6} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis width={32} tickLine={false} axisLine={false} />
            <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
            <Bar dataKey="booked" stackId="leads" fill="var(--color-booked)" maxBarSize={32} />
            <Bar
              dataKey="waiting"
              stackId="leads"
              fill="var(--color-waiting)"
              fillOpacity={0.35}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
