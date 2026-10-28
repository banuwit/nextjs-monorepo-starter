"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import { ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { TimelineChartFrame } from "@/features/chart/timeline/components/timeline-chart-frame";
import { TimelineTooltip } from "@/features/chart/timeline/components/timeline-tooltip";
import type {
  TimelineRow,
  TimelineShift,
} from "@/features/chart/timeline/types/timeline";
import {
  formatHour,
  formatHourRange,
  formatHours,
  rangeTicks,
} from "@/features/chart/timeline/utils/timeline";
import { sumBy } from "@/features/chart/utils/format";
import { shiftRoster } from "@/mocks/chart-timeline.mock";

const shiftConfig = {
  early: { label: "Early", color: "var(--chart-1)" },
  day: { label: "Day", color: "var(--chart-2)" },
  mid: { label: "Mid", color: "var(--chart-4)" },
  late: { label: "Late", color: "var(--chart-5)" },
} satisfies ChartConfig;

type Shift = keyof typeof shiftConfig;
type ShiftRow = TimelineRow<TimelineShift>;

const rows: ShiftRow[] = shiftRoster.map((shift) => ({
  ...shift,
  range: [shift.start, shift.end],
}));
const domain: [number, number] = [6, 24];
const ticks = rangeTicks(domain, 3);
const hours = sumBy(shiftRoster, (shift) => shift.end - shift.start);
const shiftOf = (row: ShiftRow) => shiftConfig[row.shift as Shift];

export function TimelineShiftCard() {
  const legend = useChartLegendToggle();
  const visible = rows.filter((row) => !legend.isHidden(row.shift));

  return (
    <ChartCard
      title="Today's roster"
      description="Resource — people × hours of the day, colored by shift"
      value={`${hours} h`}
      footer="Scheduled hours across the team. The legend filters shifts."
    >
      <TimelineChartFrame config={shiftConfig} className="h-64">
        <BarChart
          data={visible}
          layout="vertical"
          barCategoryGap={6}
          accessibilityLayer
          margin={{ left: 0, right: 16 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="person"
            type="category"
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <XAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatHour}
          />
          <ChartTooltip
            cursor={false}
            content={
              <TimelineTooltip<ShiftRow>
                getTitle={(row) => row.person}
                getGroup={shiftOf}
                formatRange={formatHourRange}
                formatDuration={formatHours}
              />
            }
          />
          <Bar dataKey="range" radius={4}>
            {visible.map((row) => (
              <Cell key={row.person} fill={`var(--color-${row.shift})`} />
            ))}
          </Bar>
        </BarChart>
      </TimelineChartFrame>
      <ChartLegendToggle
        items={legendItemsFromConfig(shiftConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
