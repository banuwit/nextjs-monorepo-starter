import {
  BrushCleaningIcon,
  DoorOpenIcon,
  HeartPulseIcon,
  MegaphoneIcon,
  PillIcon,
  ShieldAlertIcon,
  StethoscopeIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "../types/dashboard";
import type {
  ZooAnimalStatus,
  ZooEnclosure,
  ZooEnclosureStatus,
  ZooFlowPoint,
  ZooScheduleItem,
} from "../types/zoo";

type Style = { tone: StatusTone; icon: LucideIcon; label: string };

export const enclosureStatusStyles: Record<ZooEnclosureStatus, Style> = {
  open: { tone: "success", icon: DoorOpenIcon, label: "Open" },
  cleaning: {
    tone: "neutral",
    icon: BrushCleaningIcon,
    label: "Closed for cleaning",
  },
  "vet-check": { tone: "warning", icon: StethoscopeIcon, label: "Vet check" },
  "keeper-talk": {
    tone: "info",
    icon: MegaphoneIcon,
    label: "Keeper talk soon",
  },
};

export const animalStatusStyles: Record<ZooAnimalStatus, Style> = {
  healthy: { tone: "success", icon: HeartPulseIcon, label: "Healthy" },
  observation: { tone: "info", icon: StethoscopeIcon, label: "Observation" },
  treatment: { tone: "warning", icon: PillIcon, label: "Treatment" },
  quarantine: { tone: "danger", icon: ShieldAlertIcon, label: "Quarantine" },
};

/**
 * Totals up to the current hour. Points later than `hour` are blanked so the
 * chart stops at "now" instead of predicting the afternoon.
 */
export function summarizeFlow(points: readonly ZooFlowPoint[], hour: number) {
  let entries = 0;
  let exits = 0;
  const visible = points.map((point) => {
    const pointHour = Number(point.hour.slice(0, 2));
    if (pointHour > hour)
      return { hour: point.hour, entries: null, exits: null };
    entries += point.entries;
    exits += point.exits;
    return point;
  });
  return { visible, entries, exits, inside: Math.max(entries - exits, 0) };
}

export function currentHourLabel(
  points: readonly ZooFlowPoint[],
  hour: number,
) {
  const label = `${String(hour).padStart(2, "0")}:00`;
  return points.some((point) => point.hour === label) ? label : null;
}

export function isOverLimit(enclosure: ZooEnclosure) {
  const temp = enclosure.temp.at(-1) ?? 0;
  const humidity = enclosure.humidity.at(-1) ?? 0;
  return {
    temp: temp > enclosure.maxTemp,
    humidity: humidity > enclosure.maxHumidity,
  };
}

export type ScheduleState = "past" | "next" | "upcoming";

/**
 * Marks items before the current hour as past and the first remaining item as
 * next. Items in the current hour still count as upcoming.
 */
export function scheduleStates(
  items: readonly ZooScheduleItem[],
  hour: number,
): ScheduleState[] {
  let nextFound = false;
  return items.map((item) => {
    if (Number(item.time.slice(0, 2)) < hour) return "past";
    if (!nextFound) {
      nextFound = true;
      return "next";
    }
    return "upcoming";
  });
}
