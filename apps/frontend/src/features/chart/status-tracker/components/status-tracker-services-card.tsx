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
  uptimePercent,
} from "@/features/chart/status-tracker/utils/status-tracker";
import {
  serviceIncidents,
  trackerEndDate,
} from "@/mocks/chart-status-tracker.mock";

const services = serviceIncidents.map((item) => ({
  ...item,
  days: buildDailyStatus(trackerEndDate, DAYS, item.incidents),
}));

export function StatusTrackerServicesCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="System status"
      description="Multi-service — a tracker row and uptime per service"
    >
      <ul className="grid gap-4">
        {services.map((service) => (
          <li key={service.service} className="grid gap-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-medium">{service.label}</span>
              <span className="text-muted-foreground tabular-nums">
                {uptimePercent(service.days).toFixed(2)}%
              </span>
            </div>
            <StatusBlockRow
              days={service.days}
              isHidden={legend.isHidden}
              className="h-6"
            />
          </li>
        ))}
      </ul>
      <div className="mt-2">
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
