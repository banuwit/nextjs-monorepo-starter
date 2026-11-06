import {
  CircleCheckIcon,
  CirclePauseIcon,
  CirclePlayIcon,
  CircleXIcon,
  LockIcon,
  LoaderIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "../types/dashboard";
import type {
  ManufacturingDowntimeReason,
  ManufacturingMachine,
  ManufacturingMachineStatus,
  ManufacturingOee,
  ManufacturingWorkOrderStatus,
} from "../types/manufacturing";

type Style = { tone: StatusTone; icon: LucideIcon; label: string };

export const machineStatusStyles: Record<ManufacturingMachineStatus, Style> = {
  running: { tone: "success", icon: CirclePlayIcon, label: "Running" },
  idle: { tone: "neutral", icon: CirclePauseIcon, label: "Idle" },
  down: { tone: "danger", icon: CircleXIcon, label: "Down" },
  maintenance: { tone: "warning", icon: WrenchIcon, label: "Maintenance" },
};

export const workOrderStatusStyles: Record<
  ManufacturingWorkOrderStatus,
  Style
> = {
  open: { tone: "neutral", icon: CirclePauseIcon, label: "Open" },
  "in-progress": { tone: "info", icon: LoaderIcon, label: "In progress" },
  blocked: { tone: "danger", icon: LockIcon, label: "Blocked" },
  done: { tone: "success", icon: CircleCheckIcon, label: "Done" },
};

export const priorityLabels = {
  1: "P1 · Critical",
  2: "P2 · High",
  3: "P3 · Normal",
} as const;

/** OEE is the product of the three factors, each in percent. */
export function oeeFrom(oee: ManufacturingOee) {
  return (
    Math.round((oee.availability * oee.performance * oee.quality) / 100) / 100
  );
}

export function paretoRows(reasons: readonly ManufacturingDowntimeReason[]) {
  const sorted = [...reasons].sort((a, b) => b.minutes - a.minutes);
  const total = sorted.reduce((sum, row) => sum + row.minutes, 0);
  let running = 0;
  return sorted.map((row) => {
    running += row.minutes;
    return {
      ...row,
      cumulative: total ? Math.round((running / total) * 100) : 0,
    };
  });
}

export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export function dueLabel(dueMinutes: number, hour: number, minute: number) {
  if (dueMinutes < 0) {
    const overdue = -dueMinutes;
    return overdue < 60
      ? `${overdue} min overdue`
      : `${Math.round(overdue / 60)} h overdue`;
  }
  const total = hour * 60 + minute + dueMinutes;
  const days = Math.floor(total / 1440);
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  if (days === 0) return `Today ${time}`;
  if (days === 1) return `Tomorrow ${time}`;
  return `In ${days} days`;
}

export function isOverThreshold(machine: ManufacturingMachine) {
  const temp = machine.temp.at(-1) ?? 0;
  const vibration = machine.vibration.at(-1) ?? 0;
  return {
    temp: temp > machine.maxTemp,
    vibration: vibration > machine.maxVibration,
  };
}

const WINDOW = 12;

/**
 * One simulation step: the next running machine in rotation gets a new
 * reading from the delta table. Pure, so the hook can call it in setState.
 */
export function stepMachines(
  machines: ManufacturingMachine[],
  tick: number,
  deltas: ReadonlyArray<{ temp: number; vibration: number }>,
): { machines: ManufacturingMachine[]; latestId: string | null } {
  const running = machines.filter((machine) => machine.status === "running");
  if (!running.length || !deltas.length) return { machines, latestId: null };
  const target = running[tick % running.length];
  const delta = deltas[tick % deltas.length];
  if (!target || !delta) return { machines, latestId: null };
  const next = machines.map((machine) => {
    if (machine.id !== target.id) return machine;
    const lastTemp = machine.temp.at(-1) ?? 0;
    const lastVibration = machine.vibration.at(-1) ?? 0;
    return {
      ...machine,
      temp: [
        ...machine.temp,
        Math.round((lastTemp + delta.temp) * 10) / 10,
      ].slice(-WINDOW),
      vibration: [
        ...machine.vibration,
        Math.max(0, Math.round((lastVibration + delta.vibration) * 100) / 100),
      ].slice(-WINDOW),
    };
  });
  return { machines: next, latestId: target.id };
}
