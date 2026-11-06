import {
  BabyIcon,
  CircleCheckIcon,
  HourglassIcon,
  LaptopIcon,
  LogOutIcon,
  PalmtreeIcon,
  PlaneIcon,
  ThermometerIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "../types/dashboard";
import type {
  HrEmployeeStatus,
  HrHeadcountPoint,
  HrLeaveType,
  HrPipelineStage,
} from "../types/hr";

type Style = { tone: StatusTone; icon: LucideIcon; label: string };

export const leaveTypeStyles: Record<HrLeaveType, Style> = {
  annual: { tone: "info", icon: PlaneIcon, label: "Annual" },
  sick: { tone: "warning", icon: ThermometerIcon, label: "Sick" },
  remote: { tone: "neutral", icon: LaptopIcon, label: "Remote" },
  parental: { tone: "success", icon: BabyIcon, label: "Parental" },
};

export const employeeStatusStyles: Record<HrEmployeeStatus, Style> = {
  active: { tone: "success", icon: CircleCheckIcon, label: "Active" },
  "on-leave": { tone: "info", icon: PalmtreeIcon, label: "On leave" },
  probation: { tone: "warning", icon: HourglassIcon, label: "Probation" },
  notice: { tone: "danger", icon: LogOutIcon, label: "Notice period" },
};

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function sharePercent(part: number, total: number) {
  return total ? Math.round((part / total) * 100) : 0;
}

/**
 * Conversion from the previous stage, so each tile answers "how many of the
 * people who reached the last step made it here?". The first stage has none.
 */
export function stageConversion(
  stages: readonly HrPipelineStage[],
  index: number,
) {
  if (index === 0) return null;
  const previous = stages[index - 1];
  const current = stages[index];
  if (!previous || !current || !previous.count) return null;
  return Math.round((current.count / previous.count) * 100);
}

/** Flips exits negative so hires and exits stack on either side of zero. */
export function toDivergingSeries(points: readonly HrHeadcountPoint[]) {
  return points.map((point) => ({ ...point, exits: -point.exits }));
}

export function sumHeadcountChange(points: readonly HrHeadcountPoint[]) {
  return points.reduce(
    (acc, point) => ({
      hires: acc.hires + point.hires,
      exits: acc.exits + point.exits,
    }),
    { hires: 0, exits: 0 },
  );
}

const shortDate = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** Formats a yyyy-mm-dd date as "Nov 12". */
export function formatShortDate(date: string) {
  return shortDate.format(new Date(`${date}T12:00:00Z`));
}

export function formatTenure(years: number) {
  if (years < 1) return `${Math.round(years * 12)} mo`;
  return `${years.toFixed(1)} yr`;
}
