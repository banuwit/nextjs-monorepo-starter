import {
  BanIcon,
  CalendarCheckIcon,
  CircleCheckIcon,
  CircleXIcon,
  DoorOpenIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "../types/dashboard";
import type {
  HospitalityForecastDay,
  HospitalityHousekeepingStage,
  HospitalityLoyaltyTier,
  HospitalityReservationStatus,
  HospitalityReviewChannel,
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

/** Loyalty tiers map onto StatusBadge tones so Gold reads warm, Silver cool. */
export const loyaltyTierTones: Record<HospitalityLoyaltyTier, StatusTone> = {
  Gold: "warning",
  Silver: "info",
  Member: "neutral",
};

export const reviewChannelTones: Record<HospitalityReviewChannel, StatusTone> =
  {
    Google: "info",
    Booking: "info",
    TripAdvisor: "success",
  };

/**
 * Full Tailwind classes per housekeeping column, tinted like StatusBadge:
 * dirty is destructive, cleaning amber, inspecting sky, ready emerald.
 */
export const housekeepingStageStyles: Record<
  HospitalityHousekeepingStage,
  { label: string; header: string; dot: string; meter: string }
> = {
  dirty: {
    label: "Dirty",
    header: "bg-destructive/10 text-destructive dark:bg-destructive/20",
    dot: "bg-destructive",
    meter: "bg-destructive",
  },
  cleaning: {
    label: "Cleaning",
    header:
      "bg-amber-500/15 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
    meter: "bg-amber-500",
  },
  inspecting: {
    label: "Inspecting",
    header: "bg-sky-500/10 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
    dot: "bg-sky-500",
    meter: "bg-sky-500",
  },
  ready: {
    label: "Ready",
    header:
      "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    dot: "bg-emerald-500",
    meter: "bg-emerald-500",
  },
};

export const housekeepingStageOrder: readonly HospitalityHousekeepingStage[] = [
  "dirty",
  "cleaning",
  "inspecting",
  "ready",
];

export function summarizeForecast(days: readonly HospitalityForecastDay[]) {
  if (!days.length) return { occupancy: 0, adr: 0 };
  const occupancy =
    days.reduce((sum, day) => sum + day.occupancy, 0) / days.length;
  const adr = days.reduce((sum, day) => sum + day.adr, 0) / days.length;
  return { occupancy: Math.round(occupancy), adr: Math.round(adr) };
}

export function sharePercent(count: number, total: number) {
  return total ? Math.round((count / total) * 100) : 0;
}

/** "RM" from "Rina Marlina"; at most two letters. */
export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

const shortDay = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatShortDay(isoDay: string) {
  return shortDay.format(new Date(`${isoDay}T12:00:00Z`));
}

const weekday = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: "UTC",
});

/** "Fri" for an ISO day. */
export function formatWeekday(isoDay: string) {
  return weekday.format(new Date(`${isoDay}T12:00:00Z`));
}

/** "14:00" from an hour of day. */
export function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
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

/** "Rp 1,2 jt" */
export function formatIdrCompact(value: number) {
  return idrCompact.format(value);
}
