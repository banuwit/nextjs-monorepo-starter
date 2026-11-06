export const integer = new Intl.NumberFormat("en-US");

const longDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats an ISO timestamp as "Thursday, October 29, 2026" in UTC. */
export function formatLongDate(iso: string) {
  return longDate.format(new Date(iso));
}

export function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
