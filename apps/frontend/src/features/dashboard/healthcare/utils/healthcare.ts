import {
  CircleCheckIcon,
  CircleXIcon,
  CoffeeIcon,
  HourglassIcon,
  MoonIcon,
  StethoscopeIcon,
  UserCheckIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "../types/dashboard";
import type {
  HealthcareBedState,
  HealthcareDoctorStatus,
  HealthcareFlowPoint,
  HealthcareQueueStatus,
} from "../types/healthcare";

type Style = { tone: StatusTone; icon: LucideIcon; label: string };

export const queueStatusStyles: Record<HealthcareQueueStatus, Style> = {
  waiting: { tone: "warning", icon: HourglassIcon, label: "Waiting" },
  "in-consult": { tone: "info", icon: StethoscopeIcon, label: "In consult" },
  done: { tone: "success", icon: CircleCheckIcon, label: "Done" },
  "no-show": { tone: "danger", icon: CircleXIcon, label: "No-show" },
};

export const doctorStatusStyles: Record<HealthcareDoctorStatus, Style> = {
  "in-consult": { tone: "info", icon: StethoscopeIcon, label: "In consult" },
  available: { tone: "success", icon: UserCheckIcon, label: "Available" },
  "on-break": { tone: "warning", icon: CoffeeIcon, label: "On break" },
  off: { tone: "neutral", icon: MoonIcon, label: "Off shift" },
};

/** Full Tailwind classes per bed state; the legend repeats the label in text. */
export const bedStateStyles: Record<
  HealthcareBedState,
  { label: string; className: string }
> = {
  occupied: { label: "Occupied", className: "bg-chart-1" },
  available: {
    label: "Available",
    className: "bg-muted ring-1 ring-inset ring-border",
  },
  cleaning: { label: "Cleaning", className: "bg-amber-500/60" },
  reserved: { label: "Reserved", className: "bg-chart-4/60" },
};

export const bedStateOrder: readonly HealthcareBedState[] = [
  "occupied",
  "available",
  "cleaning",
  "reserved",
];

export function occupancyPercent(occupied: number, capacity: number) {
  return capacity ? Math.round((occupied / capacity) * 100) : 0;
}

export function occupancyTone(percent: number): StatusTone {
  if (percent >= 95) return "danger";
  if (percent >= 85) return "warning";
  return "success";
}

/**
 * Totals up to the current hour. Points later than `hour` are blanked so the
 * chart stops at "now" instead of predicting the afternoon.
 */
export function summarizeFlow(
  points: readonly HealthcareFlowPoint[],
  hour: number,
) {
  let arrivals = 0;
  let seen = 0;
  const visible = points.map((point) => {
    const pointHour = Number(point.hour.slice(0, 2));
    if (pointHour > hour)
      return { hour: point.hour, arrivals: null, seen: null };
    arrivals += point.arrivals;
    seen += point.seen;
    return point;
  });
  return { visible, arrivals, seen, waiting: Math.max(arrivals - seen, 0) };
}

export function currentHourLabel(
  points: readonly HealthcareFlowPoint[],
  hour: number,
) {
  const label = `${String(hour).padStart(2, "0")}:00`;
  return points.some((point) => point.hour === label) ? label : null;
}
