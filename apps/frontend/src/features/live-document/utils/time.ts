/** Fixed demo clock so sample comments and new ones share one timeline. */
export const DEMO_NOW = "2025-09-26T14:05:00";

export function currentTime() {
  return new Date(DEMO_NOW);
}

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});
const dayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

/** "9:12 AM" on the demo day, "Sep 25" otherwise. */
export function formatCommentTime(iso: string) {
  const date = new Date(iso);
  const now = currentTime();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  return sameDay ? timeFormat.format(date) : dayFormat.format(date);
}

export function formatEdited(lastEditedAt: number | null, now: number) {
  if (lastEditedAt === null) return "Edited just now";
  const seconds = Math.max(0, Math.round((now - lastEditedAt) / 1000));
  if (seconds < 45) return "Edited just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `Edited ${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `Edited ${hours} hr ago`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
