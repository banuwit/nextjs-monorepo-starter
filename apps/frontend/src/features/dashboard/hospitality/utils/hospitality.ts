import {
  BanIcon,
  CalendarCheckIcon,
  CircleCheckIcon,
  CircleXIcon,
  DoorOpenIcon,
  SparklesIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "../types/dashboard";
import type {
  HospitalityFlagReason,
  HospitalityOccupancyPoint,
  HospitalityReservationStatus,
  HospitalityRoomState,
} from "../types/hospitality";

type Style = { tone: StatusTone; icon: LucideIcon; label: string };

export const reservationStatusStyles: Record<
  HospitalityReservationStatus,
  Style
> = {
  confirmed: { tone: "info", icon: CalendarCheckIcon, label: "Confirmed" },
  "checked-in": { tone: "success", icon: DoorOpenIcon, label: "Checked-in" },
  "checked-out": {
    tone: "neutral",
    icon: CircleCheckIcon,
    label: "Checked-out",
  },
  "no-show": { tone: "danger", icon: CircleXIcon, label: "No-show" },
  cancelled: { tone: "warning", icon: BanIcon, label: "Cancelled" },
};

export const flagReasonStyles: Record<HospitalityFlagReason, Style> = {
  maintenance: { tone: "danger", icon: WrenchIcon, label: "Maintenance" },
  "deep-clean": { tone: "info", icon: SparklesIcon, label: "Deep clean" },
};

/** Full Tailwind classes per room state; the legend repeats the label in text. */
export const roomStateStyles: Record<
  HospitalityRoomState,
  { label: string; className: string }
> = {
  occupied: { label: "Occupied", className: "bg-chart-1" },
  "due-out": { label: "Due out", className: "bg-chart-4/60" },
  "vacant-clean": {
    label: "Vacant clean",
    className: "bg-muted ring-1 ring-inset ring-border",
  },
  "vacant-dirty": { label: "Vacant dirty", className: "bg-amber-500/60" },
  "out-of-order": {
    label: "Out of order",
    className: "bg-destructive/20 ring-1 ring-inset ring-destructive/40",
  },
};

export const roomStateOrder: readonly HospitalityRoomState[] = [
  "occupied",
  "due-out",
  "vacant-clean",
  "vacant-dirty",
  "out-of-order",
];

export function summarizeOccupancy(
  points: readonly HospitalityOccupancyPoint[],
  target: number,
) {
  if (!points.length) return { average: 0, aboveTarget: 0 };
  const sum = points.reduce((total, point) => total + point.occupancy, 0);
  return {
    average: Math.round((sum / points.length) * 10) / 10,
    aboveTarget: points.filter((point) => point.occupancy >= target).length,
  };
}

export function sharePercent(count: number, total: number) {
  return total ? Math.round((count / total) * 100) : 0;
}

const shortDay = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatShortDay(isoDay: string) {
  return shortDay.format(new Date(`${isoDay}T12:00:00Z`));
}

const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const idrCompact = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** "Rp 1.250.000" */
export function formatIdr(value: number) {
  return idr.format(value);
}

/** "Rp 253,3 jt" */
export function formatIdrCompact(value: number) {
  return idrCompact.format(value);
}
