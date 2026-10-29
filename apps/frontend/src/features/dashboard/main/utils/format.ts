export const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const numberCompact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

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

export function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
