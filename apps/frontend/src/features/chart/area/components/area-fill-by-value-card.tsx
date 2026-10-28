"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import { weeklyNetUsers } from "@/mocks/chart-area.mock";

const netConfig = {
  net: { label: "Net users", color: "var(--chart-2)" },
} satisfies ChartConfig;

// Where 0 sits inside the area, from the top (0) to the bottom (1). The
// gradient switches color exactly at that point.
const values = weeklyNetUsers.map((row) => row.net);
const dataMax = Math.max(...values);
const dataMin = Math.min(...values);
const zeroOffset =
  dataMax <= 0 ? 0 : dataMin >= 0 ? 1 : dataMax / (dataMax - dataMin);

export function AreaFillByValueCard() {
  const total = sumBy(weeklyNetUsers, (row) => row.net);

  return (
    <ChartCard
      title="Net user change"
      description="Fill by value — a split gradient colors weeks above 0 and below 0 differently"
      value={`${total >= 0 ? "+" : ""}${formatCompact(total)}`}
      change={8.4}
      footer="The gradient offset is computed from the data min and max, so 0 is always the split."
    >
      <ChartContainer config={netConfig} className="h-64 w-full">
        <AreaChart
          data={weeklyNetUsers}
          accessibilityLayer
          margin={{ left: -12, right: 8 }}
        >
          <defs>
            <linearGradient id="fill-by-value" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={zeroOffset}
                stopColor="var(--color-net)"
                stopOpacity={0.4}
              />
              <stop
                offset={zeroOffset}
                stopColor="var(--destructive)"
                stopOpacity={0.4}
              />
            </linearGradient>
            <linearGradient id="stroke-by-value" x1="0" y1="0" x2="0" y2="1">
              <stop offset={zeroOffset} stopColor="var(--color-net)" />
              <stop offset={zeroOffset} stopColor="var(--destructive)" />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatCompact(value)}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Area
            dataKey="net"
            type="monotone"
            fill="url(#fill-by-value)"
            stroke="url(#stroke-by-value)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
