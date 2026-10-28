"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import { sprintTasks, timelineToday } from "@/mocks/chart-timeline.mock";

const statusConfig = {
  done: { label: "Done", color: "var(--chart-4)" },
  inProgress: { label: "In progress", color: "var(--chart-2)" },
  blocked: { label: "Blocked", color: "var(--destructive)" },
  planned: { label: "Planned", color: "var(--muted-foreground)" },
} satisfies ChartConfig;

type StatusRow = TimelineRow<TimelineTask>;

const rows = toTaskRows(sprintTasks);
const domain = dayDomain(sprintTasks);
const ticks = rangeTicks(domain, 7);
const today = toDay(timelineToday);
const blocked = sprintTasks.filter((task) => task.status === "blocked").length;
const statusOf = (row: StatusRow) => statusConfig[row.status ?? "planned"];

export function TimelineStatusCard() {
  const legend = useChartLegendToggle();
  const visible = rows.filter((row) => !legend.isHidden(row.status ?? ""));

  return (
    <ChartCard
      title="Sprint tasks"
      description="Status-colored — done, in progress, blocked and planned tasks"
      value={`${blocked} blocked`}
      footer="Blocked tasks use the destructive color. The legend filters statuses."
    >
      <TimelineChartFrame config={statusConfig}>
        <BarChart
          data={visible}
          layout="vertical"
          barCategoryGap={6}
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
          <ChartTooltip
            cursor={false}
            content={
              <TimelineTooltip<StatusRow>
                getTitle={(row) => row.name}
                getGroup={statusOf}
              />
            }
          />
          <Bar dataKey="range" radius={4}>
            {visible.map((row) => (
              <Cell key={row.name} fill={statusOf(row).color} />
            ))}
          </Bar>
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
        </BarChart>
      </TimelineChartFrame>
      <ChartLegendToggle
        items={legendItemsFromConfig(statusConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
