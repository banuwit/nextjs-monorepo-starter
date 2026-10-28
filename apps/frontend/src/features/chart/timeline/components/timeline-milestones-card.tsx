"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import { ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { TimelineChartFrame } from "@/features/chart/timeline/components/timeline-chart-frame";
import { TimelineDiamond } from "@/features/chart/timeline/components/timeline-diamond";
import { TimelineTooltip } from "@/features/chart/timeline/components/timeline-tooltip";
import type {
  TimelineRow,
  TimelineTask,
} from "@/features/chart/timeline/types/timeline";
import {
  dayDomain,
  formatDay,
  rangeTicks,
  toDay,
  toTaskRows,
} from "@/features/chart/timeline/utils/timeline";
import {
  releaseMilestones,
  releasePlan,
  timelineToday,
} from "@/mocks/chart-timeline.mock";

const milestoneConfig = {
  range: { label: "Tasks", color: "var(--chart-2)" },
  milestone: { label: "Milestones", color: "var(--chart-5)" },
} satisfies ChartConfig;

const rows = toTaskRows(releasePlan);
const domain = dayDomain(releasePlan);
const ticks = rangeTicks(domain, 7);
const today = toDay(timelineToday);
const done = releaseMilestones.filter(
  (milestone) => toDay(milestone.date) <= today,
).length;

export function TimelineMilestonesCard() {
  const legend = useChartLegendToggle();
  // `hide` on the only Bar also drops the ReferenceDots, so hidden tasks
  // stay mounted but transparent, without a tooltip.
  const tasksHidden = legend.isHidden("range");

  return (
    <ChartCard
      title="Release plan"
      description="Milestones — ReferenceLine for today and diamond ReferenceDots"
      value={`${done} / ${releaseMilestones.length}`}
      footer={`Milestones reached as of ${formatDay(today)}.`}
    >
      <TimelineChartFrame config={milestoneConfig}>
        <BarChart
          data={rows}
          layout="vertical"
          barCategoryGap={10}
          accessibilityLayer
          margin={{ top: 20, left: 0, right: 16 }}
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
          {!tasksHidden && (
            <ChartTooltip
              cursor={false}
              content={
                <TimelineTooltip<TimelineRow<TimelineTask>>
                  getTitle={(row) => row.name}
                />
              }
            />
          )}
          <Bar
            dataKey="range"
            fill="var(--color-range)"
            radius={4}
            fillOpacity={tasksHidden ? 0 : 1}
          />
          <ReferenceLine
            x={today}
            stroke="var(--foreground)"
            strokeDasharray="4 4"
            label={{
              value: "Today",
              position: "top",
              className: "fill-foreground text-xs",
            }}
          />
          {!legend.isHidden("milestone") &&
            releaseMilestones.map((milestone) => (
              <ReferenceDot
                key={milestone.label}
                x={toDay(milestone.date)}
                y={milestone.task}
                shape={TimelineDiamond}
              />
            ))}
        </BarChart>
      </TimelineChartFrame>
      <ChartLegendToggle
        items={legendItemsFromConfig(milestoneConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
