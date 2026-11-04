"use client";

import { Bar, BarChart, Label, Pie, PieChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { ExceptionKind, FleetState } from "../types/map-delivery";
import {
  countByKind,
  exceptionLabels,
  exceptionTone,
  formatClock,
  summarizeFleet,
} from "../utils/map-delivery";

const splitConfig = {
  stops: { label: "Stops" },
  delivered: { label: "Delivered", color: "var(--chart-1)" },
  failed: { label: "Failed", color: "var(--chart-5)" },
  atRisk: { label: "At risk", color: "var(--chart-3)" },
  toGo: { label: "To go", color: "var(--chart-10)" },
} satisfies ChartConfig;

const hourConfig = {
  delivered: { label: "Delivered", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function FleetOverviewPanel({ state }: { state: FleetState }) {
  const summary = summarizeFleet(state);
  const kinds = countByKind(state.exceptions);
  const openExceptions = Object.values(kinds).reduce((sum, count) => sum + count, 0);
  const split = (
    [
      ["delivered", summary.delivered],
      ["failed", summary.failed],
      ["atRisk", summary.atRisk],
      ["toGo", summary.toGo],
    ] as const
  ).map(([key, value]) => ({ key, value, fill: `var(--color-${key})` }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <ChartContainer config={splitConfig} className="aspect-square h-28 shrink-0">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="key" hideLabel />} />
            <Pie data={split} dataKey="value" nameKey="key" innerRadius={36} outerRadius={52} strokeWidth={3}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-semibold">
                        {summary.total}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 14} className="fill-muted-foreground text-[0.625rem]">
                        stops
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <dl className="grid flex-1 grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          {split.map((slice) => (
            <div key={slice.key} className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: slice.fill }} aria-hidden />
              <dt className="text-muted-foreground">{splitConfig[slice.key].label}</dt>
              <dd className="ml-auto font-medium tabular-nums">{slice.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="On-time" value={`${summary.onTimeRate}%`} />
        <Stat label="Last van back" value={formatClock(summary.lastReturn)} />
        <Stat label="On road" value={`${summary.onRoad}`} hint={`${summary.offRoad} off road`} />
      </div>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-medium text-muted-foreground">
          Open exceptions <span className="text-foreground">{openExceptions}</span>
        </h3>
        <ul className="flex flex-wrap gap-1.5">
          {(Object.keys(kinds) as ExceptionKind[]).map((kind) => (
            <li
              key={kind}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs",
                kinds[kind] ? exceptionTone[kind].badge : "bg-muted text-muted-foreground",
              )}
            >
              <span className={cn("size-1.5 rounded-full", exceptionTone[kind].dot)} aria-hidden />
              {exceptionLabels[kind]}
              <span className="font-semibold tabular-nums">{kinds[kind]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-1">
        <h3 className="text-xs font-medium text-muted-foreground">Deliveries per hour</h3>
        <ChartContainer config={hourConfig} className="aspect-auto h-24 w-full">
          <BarChart data={summary.perHour} margin={{ top: 4, left: 0, right: 0, bottom: 0 }}>
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={6} fontSize={10} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="delivered" fill="var(--color-delivered)" radius={4} />
          </BarChart>
        </ChartContainer>
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/60 px-2.5 py-2">
      <div className="text-[0.6875rem] text-muted-foreground">{label}</div>
      <div className="text-base font-semibold tabular-nums">{value}</div>
      {hint && <div className="text-[0.6875rem] text-muted-foreground">{hint}</div>}
    </div>
  );
}
