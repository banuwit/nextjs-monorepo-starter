"use client";

import { useState } from "react";
import { Area, AreaChart, Brush, CartesianGrid, XAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { BrushRange } from "@/features/chart/brush-sync/types/brush-sync";
import {
  brushStyle,
  formatDay,
  lastRange,
  sliceRange,
} from "@/features/chart/brush-sync/utils/brush-sync";
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import { dailySessions } from "@/mocks/chart-brush-sync.mock";

const sessionsConfig = {
  sessions: { label: "Sessions", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function BrushSyncAreaCard() {
  const [range, setRange] = useState<BrushRange>(() =>
    lastRange(dailySessions.length, 45),
  );
  const visible = sliceRange(dailySessions, range);
  const first = visible[0];
  const last = visible[visible.length - 1];

  return (
    <ChartCard
      title="Sessions"
      description="Brush on area — drag the handles under a 180-day series to pick the window"
      className="@4xl/main:col-span-2"
      value={formatCompact(sumBy(visible, (row) => row.sessions))}
      footer={
        first && last
          ? `${formatDay(first.date)} – ${formatDay(last.date)} · ${visible.length} days selected`
          : undefined
      }
    >
      <ChartContainer
        config={sessionsConfig}
        className="aspect-auto h-72 w-full"
      >
        <AreaChart
          data={dailySessions}
          accessibilityLayer
          margin={{ left: 8, right: 8 }}
        >
          <defs>
            <linearGradient
              id="fill-brush-sessions"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="var(--color-sessions)"
                stopOpacity={0.5}
              />
              <stop
                offset="95%"
                stopColor="var(--color-sessions)"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value: string) => formatDay(value)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelFormatter={(value) => formatDay(String(value), "long")}
              />
            }
          />
          <Area
            dataKey="sessions"
            type="monotone"
            fill="url(#fill-brush-sessions)"
            stroke="var(--color-sessions)"
          />
          <Brush
            {...brushStyle}
            height={40}
            dataKey="date"
            startIndex={range.startIndex}
            endIndex={range.endIndex}
            tickFormatter={(value: string) => formatDay(value)}
            onChange={(next) => {
              if (
                next.startIndex !== range.startIndex ||
                next.endIndex !== range.endIndex
              ) {
                setRange(next);
              }
            }}
          >
            <AreaChart data={dailySessions}>
              <Area
                dataKey="sessions"
                type="monotone"
                fill="var(--color-sessions)"
                fillOpacity={0.2}
                stroke="var(--color-sessions)"
                isAnimationActive={false}
              />
            </AreaChart>
          </Brush>
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
