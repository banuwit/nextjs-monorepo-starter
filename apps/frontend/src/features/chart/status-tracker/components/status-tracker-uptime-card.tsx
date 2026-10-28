"use client";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import { StatusBlockRow } from "@/features/chart/status-tracker/components/status-block-row";
import { StatusTrackerAxis } from "@/features/chart/status-tracker/components/status-tracker-axis";
import {
  DAYS,
  dayStatusItems,
} from "@/features/chart/status-tracker/utils/status-meta";
import {
  buildDailyStatus,
  countBy,
  uptimePercent,
} from "@/features/chart/status-tracker/utils/status-tracker";
import {
  apiIncidents,
  trackerEndDate,
} from "@/mocks/chart-status-tracker.mock";

const apiDays = buildDailyStatus(trackerEndDate, DAYS, apiIncidents);

export function StatusTrackerUptimeCard() {
  const legend = useChartLegendToggle();
  const counts = countBy(apiDays, (day) => day.status);

  return (
    <ChartCard
      title="Public API"
      description="90-day uptime — one block per day with a tooltip"
      value={`${uptimePercent(apiDays).toFixed(2)}%`}
      footer={`${counts.outage ?? 0} outages and ${counts.degraded ?? 0} degraded days in the last ${DAYS} days.`}
    >
      <div className="grid gap-2">
        <StatusBlockRow days={apiDays} isHidden={legend.isHidden} />
        <StatusTrackerAxis />
      </div>
      <ChartLegendToggle
        items={dayStatusItems}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
