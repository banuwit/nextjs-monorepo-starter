"use client";

import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { manufactureOee } from "@/mocks/dashboard-manufacture.mock";

import { ARC, polarPoint, valueToAngle } from "../utils/gauge";
import { oeeFrom } from "../utils/manufacture";

const chartConfig = {
  oee: { label: "OEE", color: "var(--chart-1)" },
} satisfies ChartConfig;

const factors = [
  { key: "availability", label: "Availability", className: "bg-chart-1" },
  { key: "performance", label: "Performance", className: "bg-chart-2" },
  { key: "quality", label: "Quality", className: "bg-chart-3" },
] as const;

export function ManufactureOee() {
  const oee = oeeFrom(manufactureOee);
  const { target } = manufactureOee;
  const data = [
    { part: "oee", amount: oee, fill: "var(--color-oee)" },
    { part: "remaining", amount: 100 - oee, fill: "var(--muted)" },
  ];

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>OEE</CardTitle>
        <CardDescription>
          Availability × performance × quality, this shift
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-auto h-40 w-full max-w-72"
          role="img"
          aria-label={`OEE ${oee}% against a ${target}% target`}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="part"
              startAngle={ARC.startAngle}
              endAngle={ARC.endAngle}
              cy={ARC.cy}
              innerRadius={ARC.inner}
              outerRadius={ARC.outer}
              stroke="none"
              isAnimationActive={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;
                  const cx = viewBox.cx ?? 0;
                  const cy = ARC.cy;
                  const angle = valueToAngle(target, 0, 100);
                  const from = polarPoint(cx, cy, ARC.inner - 6, angle);
                  const to = polarPoint(cx, cy, ARC.outer + 6, angle);
                  return (
                    <g>
                      <line
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        strokeWidth={3}
                        strokeLinecap="round"
                        className="stroke-foreground"
                      />
                      <text x={cx} y={cy - 24} textAnchor="middle">
                        <tspan className="fill-foreground text-2xl font-semibold">
                          {oee}%
                        </tspan>
                      </text>
                      <text
                        x={cx}
                        y={cy - 4}
                        textAnchor="middle"
                        className="fill-muted-foreground"
                      >
                        target {target}%
                      </text>
                    </g>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <dl className="flex flex-col gap-3">
          {factors.map((factor) => {
            const value = manufactureOee[factor.key];
            return (
              <div key={factor.key} className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <dt className="text-muted-foreground">{factor.label}</dt>
                  <dd className="font-semibold tabular-nums">{value}%</dd>
                </div>
                <div
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={value}
                  aria-label={factor.label}
                  className="h-1.5 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className={cn("h-full rounded-full", factor.className)}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </dl>
      </CardContent>
    </Card>
  );
}
