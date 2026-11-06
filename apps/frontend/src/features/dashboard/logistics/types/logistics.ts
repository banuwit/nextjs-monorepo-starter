export type LogisticsStageKey =
  "picked" | "in-transit" | "out-for-delivery" | "delivered" | "failed";

export type LogisticsStage = {
  key: LogisticsStageKey;
  label: string;
  count: number;
};

export type LogisticsOnTimePoint = {
  /** ISO day, e.g. "2026-11-06". */
  date: string;
  onTime: number;
  deliveries: number;
};

export type LogisticsFleet = {
  moving: number;
  idle: number;
  maintenance: number;
};

export type LogisticsStopStatus = "done" | "pending" | "failed";

export type LogisticsStop = {
  id: string;
  label: string;
  status: LogisticsStopStatus;
  /** Schematic coordinates inside the 600×240 route board. */
  x: number;
  y: number;
};

export type LogisticsRoute = {
  id: string;
  driver: string;
  vehicle: string;
  /** Index into the chart palette: 1–5. */
  color: 1 | 2 | 3 | 4 | 5;
  /** 0–1 share of the route already driven. */
  progress: number;
  nextEtaMinutes: number | null;
  stops: LogisticsStop[];
};

export type LogisticsException = {
  id: string;
  severity: "danger" | "warning" | "info";
  title: string;
  detail: string;
  routeId?: string;
  minutesAgo: number;
};

export type LogisticsShipment = {
  id: string;
  customer: string;
  area: string;
  routeId: string;
  status: LogisticsStageKey;
  /** Minutes from now; null when the shipment is already closed. */
  etaMinutes: number | null;
  /** "HH:mm" when delivered or failed. */
  closedAt?: string;
  stopsLeft: number;
  weightKg: number;
};
