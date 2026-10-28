import type {
  TimelineRow,
  TimelineTask,
} from "@/features/chart/timeline/types/timeline";

const DAY = 86_400_000;
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * "2026-03-02" → whole days since 1970-01-01 (UTC). Plain numbers keep the
 * axis math simple and render the same on the server and the client.
 */
export function toDay(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year!, month! - 1, day!) / DAY;
}

/** Day number → "Mar 2". Fixed format, no locale or time zone involved. */
export function formatDay(day: number) {
  const date = new Date(day * DAY);
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

/** Exclusive end, so the last day shown is `end - 1`. */
export function formatDayRange([start, end]: [number, number]) {
  return `${formatDay(start)} – ${formatDay(end - 1)}`;
}

export const formatDays = ([start, end]: [number, number]) =>
  `${end - start} ${end - start === 1 ? "day" : "days"}`;

/** 9 → "09:00", 13.5 → "13:30". */
export function formatHour(hour: number) {
  const minutes = Math.round((hour % 1) * 60);
  return `${String(Math.floor(hour)).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export const formatHourRange = ([start, end]: [number, number]) =>
  `${formatHour(start)} – ${formatHour(end)}`;

export const formatHours = ([start, end]: [number, number]) =>
  `${end - start} h`;

/** Adds the numeric `[start, end]` range used as the Bar `dataKey`. */
export function toTaskRows<T extends TimelineTask>(
  tasks: readonly T[],
): TimelineRow<T>[] {
  return tasks.map((task) => ({
    ...task,
    range: [toDay(task.start), toDay(task.end)],
  }));
}

/** First start and last end of the tasks, as the axis domain. */
export function dayDomain(tasks: readonly TimelineTask[]): [number, number] {
  return [
    Math.min(...tasks.map((task) => toDay(task.start))),
    Math.max(...tasks.map((task) => toDay(task.end))),
  ];
}

/** Evenly spaced ticks from `start`, e.g. every Monday with `step = 7`. */
export function rangeTicks([start, end]: [number, number], step: number) {
  const ticks: number[] = [];
  for (let tick = start; tick <= end; tick += step) ticks.push(tick);
  return ticks;
}
