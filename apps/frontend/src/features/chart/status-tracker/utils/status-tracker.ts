import type {
  DailyStatus,
  Incident,
} from "@/features/chart/status-tracker/types/status-tracker";

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Builds one status per day, oldest first, ending at `endDate` (ISO date).
 * Days missing from `incidents` (keyed by days ago) are operational.
 */
export function buildDailyStatus(
  endDate: string,
  days: number,
  incidents: Record<number, Incident>,
): DailyStatus[] {
  const end = Date.parse(`${endDate}T00:00:00Z`);

  return Array.from({ length: days }, (_, index) => {
    const daysAgo = days - 1 - index;
    const incident = incidents[daysAgo];
    return {
      date: dayFormatter.format(end - daysAgo * 86_400_000),
      status: incident?.status ?? "operational",
      downtime: incident?.downtime ?? 0,
    };
  });
}

/** Share of minutes without downtime across the given days. */
export function uptimePercent(days: readonly DailyStatus[]) {
  if (!days.length) return 100;
  const downtime = days.reduce((total, day) => total + day.downtime, 0);
  return (1 - downtime / (days.length * 1440)) * 100;
}

export function countBy<T, K extends string>(
  rows: readonly T[],
  pick: (row: T) => K,
) {
  return rows.reduce<Partial<Record<K, number>>>((counts, row) => {
    const key = pick(row);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

/** 312 → "5m 12s". */
export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes ? `${minutes}m ${rest}s` : `${rest}s`;
}
