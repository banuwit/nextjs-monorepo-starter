const TIME_ZONE = "Asia/Jakarta";

/**
 * Today's calendar date in the workspace time zone, pinned to noon UTC so
 * formatting it in UTC never shifts the day. Call from Server Components.
 */
export function workspaceToday(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(now)
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T12:00:00Z`;
}

/** Hour of day (0–23) in the workspace time zone. */
export function workspaceHour(now = new Date()) {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      hour: "numeric",
      hourCycle: "h23",
    }).format(now),
  );
}
