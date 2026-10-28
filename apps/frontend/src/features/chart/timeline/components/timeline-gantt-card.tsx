"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import { ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { TimelineChartFrame } from "@/features/chart/timeline/components/timeline-chart-frame";
import { TimelineTooltip } from "@/features/chart/timeline/components/timeline-tooltip";
import type {
  TimelineRow,
  TimelineTask,
} from "@/features/chart/timeline/types/timeline";
import {
  dayDomain,
  formatDay,
  rangeTicks,
  toTaskRows,
} from "@/features/chart/timeline/utils/timeline";
import { projectPlan } from "@/mocks/chart-timeline.mock";

const ganttConfig = {
  range: { label: "Task", color: "var(--chart-3)" },
} satisfies ChartConfig;

const rows = toTaskRows(projectPlan);
const domain = dayDomain(projectPlan);
// The plan starts on a Monday, so weekly ticks land on Mondays.
const ticks = rangeTicks(domain, 7);
const weeks = Math.round((domain[1] - domain[0]) / 7);

export function TimelineGanttCard() {
  return (
    <ChartCard
      title="Project plan"
      description="Gantt — ranged bars [start, end] on a date axis"
      value={`${weeks} weeks`}
      footer={`${formatDay(domain[0])} – ${formatDay(domain[1] - 1)}. The Bar dataKey returns a [start, end] pair.`}
    >
      <TimelineChartFrame config={ganttConfig}>
        <BarChart
          data={rows}
          layout="vertical"
          barCategoryGap={6}
          accessibilityLayer
          margin={{ left: 0, right: 16 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            width={104}
          />
          <XAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatDay}
          />
          <ChartTooltip
            cursor={false}
            content={
              <TimelineTooltip<TimelineRow<TimelineTask>>
                getTitle={(row) => row.name}
              />
            }
          />
          <Bar dataKey="range" fill="var(--color-range)" radius={4} />
        </BarChart>
      </TimelineChartFrame>
    </ChartCard>
  );
}
