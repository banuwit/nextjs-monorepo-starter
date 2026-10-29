export const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const numberCompact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const integer = new Intl.NumberFormat("en-US");

const shortDate = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const longDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats an ISO date (YYYY-MM-DD or full ISO) as "Oct 29, 2026" in UTC. */
export function formatShortDate(iso: string) {
  return shortDate.format(new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso));
}

/** Formats an ISO timestamp as "Thursday, October 29, 2026" in UTC. */
export function formatLongDate(iso: string) {
  return longDate.format(new Date(iso));
}

/** Signed percentage change between two values, e.g. "+12.5%". */
export function percentChange(current: number, previous: number) {
  if (!previous) return null;
  const change = ((current - previous) / previous) * 100;
  return {
    value: `${change > 0 ? "+" : ""}${change.toFixed(1)}%`,
    direction: change > 0 ? "up" : change < 0 ? "down" : "flat",
  } as const;
}

/** Whole days from `from` to `to` (both ISO dates), rounded down. */
export function daysBetween(from: string, to: string) {
  return Math.floor(
    (Date.parse(`${to.slice(0, 10)}T00:00:00Z`) -
      Date.parse(`${from.slice(0, 10)}T00:00:00Z`)) /
      86_400_000,
  );
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
