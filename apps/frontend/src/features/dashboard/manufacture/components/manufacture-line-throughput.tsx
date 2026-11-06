"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
import {
  manufactureLines,
  manufactureShifts,
} from "@/mocks/dashboard-manufacture.mock";

import type { ManufactureShift } from "../types/manufacture";

const chartConfig = {
  actual: { label: "Actual (units/hr)", color: "var(--chart-1)" },
  target: { label: "Target", color: "var(--muted-foreground)" },
  behind: { label: "Below 90% of target", color: "var(--destructive)" },
} satisfies ChartConfig;

export function ManufactureLineThroughput() {
  const [shift, setShift] = useState<ManufactureShift>("Morning");
  const rows = manufactureLines.filter((line) => line.shift === shift);
  const behind = rows.filter((line) => line.actual < line.target * 0.9).length;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Line throughput</CardTitle>
        <CardDescription aria-live="polite">
          {shift} shift.{" "}
          {behind
            ? `${behind} of ${rows.length} lines below 90% of target.`
            : "Every line is on target."}
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={[shift]}
            onValueChange={(value) => {
              const next = manufactureShifts.find(
                (candidate) => candidate === value[0],
              );
              if (next) setShift(next);
            }}
            variant="outline"
            size="sm"
            aria-label="Shift"
          >
            {manufactureShifts.map((candidate) => (
              <ToggleGroupItem key={candidate} value={candidate}>
                {candidate}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto min-h-64 w-full flex-1"
          role="img"
          aria-label={`Units per hour by line for the ${shift} shift, against each line's target`}
        >
          <BarChart
            data={rows}
            layout="vertical"
            accessibilityLayer
            margin={{ left: 4, right: 36, top: 4 }}
            barGap={-18}
          >
            <CartesianGrid horizontal={false} strokeOpacity={0.6} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              domain={[0, 140]}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={132}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="target"
              fill="transparent"
              stroke="var(--color-target)"
              strokeDasharray="3 3"
              radius={4}
              barSize={18}
              isAnimationActive={false}
            />
            <Bar
              dataKey="actual"
              radius={4}
              barSize={18}
              isAnimationActive={false}
            >
              {rows.map((line) => (
                <Cell
                  key={`${line.id}-${line.shift}`}
                  fill={
                    line.actual < line.target * 0.9
                      ? "var(--color-behind)"
                      : "var(--color-actual)"
                  }
                />
              ))}
              <LabelList
                dataKey="actual"
                position="right"
                className="fill-foreground"
                fontSize={11}
                formatter={(value) => `${Number(value)}`}
              />
            </Bar>
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
