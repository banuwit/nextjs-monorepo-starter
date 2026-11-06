import {
  CircleCheckIcon,
  CircleXIcon,
  PackageIcon,
  TruckIcon,
  WarehouseIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "../types/dashboard";
import type {
  LogisticsOnTimePoint,
  LogisticsShipment,
  LogisticsStageKey,
} from "../types/logistics";

type Style = { tone: StatusTone; icon: LucideIcon; label: string };

export const shipmentStatusStyles: Record<LogisticsStageKey, Style> = {
  picked: { tone: "neutral", icon: WarehouseIcon, label: "Picked up" },
  "in-transit": { tone: "info", icon: TruckIcon, label: "In transit" },
  "out-for-delivery": {
    tone: "warning",
    icon: PackageIcon,
    label: "Out for delivery",
  },
  delivered: { tone: "success", icon: CircleCheckIcon, label: "Delivered" },
  failed: { tone: "danger", icon: CircleXIcon, label: "Failed" },
};

export function stageShare(count: number, total: number) {
  return total ? Math.round((count / total) * 100) : 0;
}

export function summarizeOnTime(
  points: readonly LogisticsOnTimePoint[],
  sla: number,
) {
  if (!points.length) return { average: 0, underSla: 0 };
  const sum = points.reduce((total, point) => total + point.onTime, 0);
  return {
    average: Math.round((sum / points.length) * 10) / 10,
    underSla: points.filter((point) => point.onTime < sla).length,
  };
}

const shortDay = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatShortDay(isoDay: string) {
  return shortDay.format(new Date(`${isoDay}T12:00:00Z`));
}

/** "14:20" style ETA from the current hour, or a closed state label. */
export function etaLabel(
  shipment: LogisticsShipment,
  hour: number,
  minute: number,
) {
  if (shipment.status === "delivered")
    return `Delivered ${shipment.closedAt ?? ""}`.trim();
  if (shipment.status === "failed")
    return `Failed ${shipment.closedAt ?? ""}`.trim();
  if (shipment.etaMinutes === null) return "—";
  const total = hour * 60 + minute + shipment.etaMinutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

type Point = { x: number; y: number };

/** Point `t` (0–1) along a polyline, by segment length. */
export function pointAlongPath(points: readonly Point[], t: number) {
  if (points.length === 0) return { x: 0, y: 0 };
  if (points.length === 1)
    return { x: points[0]?.x ?? 0, y: points[0]?.y ?? 0 };
  const lengths: number[] = [];
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const a = points[index - 1];
    const b = points[index];
    const length = a && b ? Math.hypot(b.x - a.x, b.y - a.y) : 0;
    lengths.push(length);
    total += length;
  }
  let remaining = Math.min(Math.max(t, 0), 1) * total;
  for (let index = 0; index < lengths.length; index += 1) {
    const length = lengths[index] ?? 0;
    const a = points[index];
    const b = points[index + 1];
    if (!a || !b) break;
    if (remaining <= length || index === lengths.length - 1) {
      const ratio = length ? Math.min(remaining / length, 1) : 0;
      return { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio };
    }
    remaining -= length;
  }
  const last = points[points.length - 1];
  return { x: last?.x ?? 0, y: last?.y ?? 0 };
}

export function polylinePoints(points: readonly Point[]) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}
