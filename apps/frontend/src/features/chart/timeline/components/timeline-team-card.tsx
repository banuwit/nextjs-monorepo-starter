"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
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
import { teamPlan } from "@/mocks/chart-timeline.mock";

const teamConfig = {
  design: { label: "Design", color: "var(--chart-1)" },
  backend: { label: "Backend", color: "var(--chart-3)" },
  frontend: { label: "Frontend", color: "var(--chart-4)" },
  qa: { label: "QA", color: "var(--chart-5)" },
} satisfies ChartConfig;

type Team = keyof typeof teamConfig;
type TeamRow = TimelineRow<TimelineTask>;

const rows = toTaskRows(teamPlan);
// Keep the axis fixed while teams are filtered out.
const domain = dayDomain(teamPlan);
const ticks = rangeTicks(domain, 7);
const teamOf = (row: TeamRow) => teamConfig[row.team as Team];

export function TimelineTeamCard() {
  const legend = useChartLegendToggle();
  const visible = rows.filter((row) => !legend.isHidden(row.team ?? ""));

  return (
    <ChartCard
      title="Roadmap by team"
      description="Grouped by team — one color per team, the legend filters teams"
      value={`${visible.length} tasks`}
      footer="Rows are filtered, colors come from the team and stay stable."
    >
      <TimelineChartFrame config={teamConfig}>
        <BarChart
          data={visible}
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
              <TimelineTooltip<TeamRow>
                getTitle={(row) => row.name}
                getGroup={teamOf}
              />
            }
          />
          <Bar dataKey="range" radius={4}>
            {visible.map((row) => (
              <Cell key={row.name} fill={`var(--color-${row.team})`} />
            ))}
          </Bar>
        </BarChart>
      </TimelineChartFrame>
      <ChartLegendToggle
        items={legendItemsFromConfig(teamConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
