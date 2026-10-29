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

/** Whole days from `from` to `to` (both ISO dates), rounded down. */
export function daysBetween(from: string, to: string) {
  return Math.floor(
    (Date.parse(`${to.slice(0, 10)}T00:00:00Z`) -
      Date.parse(`${from.slice(0, 10)}T00:00:00Z`)) /
      86_400_000,
  );
}
