import type { DayStatus } from "@/features/chart/status-tracker/types/status-tracker";

export const DAYS = 90;
/** Days shown below the `@xl/main` breakpoint so blocks stay tappable. */

export const COMPACT_DAYS = 45;

export const dayStatusMeta: Record<
  DayStatus,
  { label: string; className: string; color: string }
> = {
  operational: {
    label: "Operational",
    className: "bg-chart-1",
    color: "var(--chart-1)",
  },
  degraded: {
    label: "Degraded",
    className: "bg-chart-3",
    color: "var(--chart-3)",
  },
  outage: {
    label: "Outage",
    className: "bg-destructive",
    color: "var(--destructive)",
  },
};

export const dayStatusItems = (Object.keys(dayStatusMeta) as DayStatus[]).map(
  (key) => ({
    key,
    label: dayStatusMeta[key].label,
    color: dayStatusMeta[key].color,
  }),
);
