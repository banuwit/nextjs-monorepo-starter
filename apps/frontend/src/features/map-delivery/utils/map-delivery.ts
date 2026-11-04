import type {
  ExceptionKind,
  FailReason,
  FleetException,
  FleetState,
  LngLat,
  Powertrain,
  Stop,
  TimeWindow,
  Van,
  VanBody,
  VanStatus,
} from "../types/map-delivery";

export const bodyLabels: Record<VanBody, string> = {
  "cargo-van": "Cargo van",
  "box-truck": "Box truck",
  reefer: "Reefer",
  "cargo-bike": "Cargo bike",
};

export const powertrainLabels: Record<Powertrain, string> = {
  ev: "Electric",
  diesel: "Diesel",
  gas: "Gasoline",
};

export const statusLabels: Record<VanStatus, string> = {
  "en-route": "En route",
  loading: "Loading",
  returning: "Returning",
  "at-depot": "At depot",
  breakdown: "Breakdown",
  retired: "Retired",
};

export const exceptionLabels: Record<ExceptionKind, string> = {
  breakdown: "Breakdown",
  "late-stop": "Late stop",
  "low-range": "Low range",
  "cargo-temp": "Cargo temperature",
  "failed-attempt": "Failed attempt",
};

export const failReasonLabels: Record<FailReason, string> = {
  "no-answer": "No answer at the door",
  "wrong-address": "Wrong address",
  refused: "Refused by recipient",
  damaged: "Parcel damaged",
  "no-access": "No access to building",
};

/** Worst first. Used for the dot colour on van markers and timeline sorting. */
const exceptionSeverity: Record<ExceptionKind, number> = {
  breakdown: 4,
  "cargo-temp": 3,
  "low-range": 2,
  "late-stop": 1,
  "failed-attempt": 0,
};

/** Tailwind classes are written in full so the compiler keeps them. */
export const exceptionTone: Record<
  ExceptionKind,
  { dot: string; badge: string }
> = {
  breakdown: { dot: "bg-red-500", badge: "bg-red-500/15 text-red-700 dark:text-red-300" },
  "cargo-temp": { dot: "bg-sky-500", badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  "low-range": { dot: "bg-amber-500", badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  "late-stop": { dot: "bg-orange-500", badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
  "failed-attempt": { dot: "bg-rose-500", badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
};

export const statusTone: Record<VanStatus, string> = {
  "en-route": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  loading: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  returning: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  "at-depot": "bg-muted text-muted-foreground",
  breakdown: "bg-red-500/15 text-red-700 dark:text-red-300",
  retired: "bg-muted text-muted-foreground line-through",
};

export const vanPalette = [
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

export function vanColor(index: number) {
  return vanPalette[index % vanPalette.length] ?? vanPalette[0]!;
}

export function toMinutes(time: string) {
  const [h = "0", m = "0"] = time.split(":");
  return Number(h) * 60 + Number(m);
}

export function fromMinutes(minutes: number) {
  const clamped = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addMinutes(time: string, minutes: number) {
  return fromMinutes(toMinutes(time) + minutes);
}

/** "13:05" → "1:05 PM" */
export function formatClock(time: string) {
  const total = toMinutes(time);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatWindow(window: TimeWindow) {
  return `${formatClock(window.start)}–${formatClock(window.end)}`;
}

export function formatDistanceKm(km: number) {
  return `${Math.round(km)} km`;
}

/** Haversine distance in km. */
export function distanceKm(a: LngLat, b: LngLat) {
  const r = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}

export function bearing(a: LngLat, b: LngLat) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const y = Math.sin(toRad(b[0] - a[0])) * Math.cos(toRad(b[1]));
  const x =
    Math.cos(toRad(a[1])) * Math.sin(toRad(b[1])) -
    Math.sin(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.cos(toRad(b[0] - a[0]));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Open stops are visited in ETA order; that is the "road order" of the route. */
export function stopsForVan(stops: Stop[], vanId: string) {
  return stops
    .filter((stop) => stop.vanId === vanId)
    .sort((a, b) => toMinutes(a.eta) - toMinutes(b.eta));
}

export function openStops(stops: Stop[]) {
  return stops.filter((stop) => stop.status === "to-go");
}

export function nextStop(stops: Stop[], vanId: string) {
  return openStops(stopsForVan(stops, vanId))[0];
}

/** An open stop whose ETA has slipped past its window is "at risk". */
export function isAtRisk(stop: Stop) {
  return stop.status === "to-go" && toMinutes(stop.eta) > toMinutes(stop.window.end);
}

/** Km from the van through every open stop and back to the depot. */
export function routeNeedKm(van: Van, stops: Stop[], depot: LngLat) {
  const remaining = openStops(stopsForVan(stops, van.id));
  let km = 0;
  let cursor = van.position;
  for (const stop of remaining) {
    km += distanceKm(cursor, stop.position);
    cursor = stop.position;
  }
  // Road distance is longer than the crow flies; 1.35 is a fair city factor.
  return (km + distanceKm(cursor, depot)) * 1.35;
}

/** Route line: van → open stops in order → depot. */
export function routePath(van: Van, stops: Stop[], depot: LngLat): LngLat[] {
  return [
    van.position,
    ...openStops(stopsForVan(stops, van.id)).map((stop) => stop.position),
    depot,
  ];
}

export function parcelsOnBoard(van: Van, stops: Stop[]) {
  return openStops(stopsForVan(stops, van.id)).reduce(
    (sum, stop) => sum + stop.parcels,
    0,
  );
}

export function worstException(exceptions: FleetException[], vanId: string) {
  return exceptions
    .filter((item) => item.vanId === vanId && !item.acknowledged)
    .sort((a, b) => exceptionSeverity[b.kind] - exceptionSeverity[a.kind])[0];
}

export function sortExceptions(exceptions: FleetException[]) {
  return [...exceptions].sort((a, b) => toMinutes(b.at) - toMinutes(a.at));
}

export function countByKind(exceptions: FleetException[]) {
  const counts = {} as Record<ExceptionKind, number>;
  for (const kind of Object.keys(exceptionLabels) as ExceptionKind[]) {
    counts[kind] = 0;
  }
  for (const item of exceptions) {
    if (!item.acknowledged) counts[item.kind] += 1;
  }
  return counts;
}

export type FleetSummary = {
  delivered: number;
  failed: number;
  atRisk: number;
  toGo: number;
  total: number;
  onTimeRate: number;
  lastReturn: string;
  onRoad: number;
  offRoad: number;
  perHour: { hour: string; delivered: number }[];
};

export function summarizeFleet(state: FleetState): FleetSummary {
  const active = state.vans.filter((van) => van.status !== "retired");
  const stops = state.stops.filter((stop) =>
    active.some((van) => van.id === stop.vanId),
  );
  const delivered = stops.filter((stop) => stop.status === "delivered");
  const failed = stops.filter((stop) => stop.status === "failed").length;
  const atRisk = stops.filter(isAtRisk).length;
  const toGo = stops.filter((stop) => stop.status === "to-go").length - atRisk;
  const onTime = delivered.filter(
    (stop) =>
      stop.completedAt && toMinutes(stop.completedAt) <= toMinutes(stop.window.end),
  ).length;
  const onRoad = active.filter((van) =>
    ["en-route", "returning"].includes(van.status),
  ).length;
  const lastReturn = active.reduce(
    (latest, van) =>
      toMinutes(van.returnEta) > toMinutes(latest) ? van.returnEta : latest,
    "00:00",
  );
  const perHour = [13, 14, 15, 16, 17].map((hour) => ({
    hour: formatClock(`${hour}:00`).replace(":00", ""),
    delivered: delivered.filter(
      (stop) => stop.completedAt && Math.floor(toMinutes(stop.completedAt) / 60) === hour,
    ).length,
  }));
  return {
    delivered: delivered.length,
    failed,
    atRisk,
    toGo,
    total: stops.length,
    onTimeRate: delivered.length ? Math.round((onTime / delivered.length) * 100) : 0,
    lastReturn,
    onRoad,
    offRoad: active.length - onRoad,
    perHour,
  };
}

/** Pick the first van that still has room for the parcels, nearest first. */
export function suggestVan(state: FleetState, position: LngLat, parcels: number) {
  return state.vans
    .filter((van) => ["en-route", "loading"].includes(van.status))
    .filter((van) => parcelsOnBoard(van, state.stops) + parcels <= van.capacity)
    .sort(
      (a, b) =>
        distanceKm(a.position, position) - distanceKm(b.position, position),
    )[0];
}

/** Move a point a fraction of the way toward a target. */
export function stepToward(from: LngLat, to: LngLat, fraction: number): LngLat {
  return [
    from[0] + (to[0] - from[0]) * fraction,
    from[1] + (to[1] - from[1]) * fraction,
  ];
}

export function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
