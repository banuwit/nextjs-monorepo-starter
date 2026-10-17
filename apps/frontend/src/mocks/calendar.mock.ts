import { format, startOfMonth } from "date-fns";
import type {
  CalendarEvent,
  CalendarId,
} from "@/features/calendar/calendar-model";

// Demo events adapted from Studio Admin; see features/calendar/LICENSE.
export function createDemoEvents(today: Date): CalendarEvent[] {
  const month = format(startOfMonth(today), "yyyy-MM");
  const day = (value: number) => `${month}-${String(value).padStart(2, "0")}`;
  const event = (
    id: string,
    title: string,
    start: string,
    calendar: CalendarId,
    extra: Partial<CalendarEvent> = {},
  ): CalendarEvent => ({
    id,
    title,
    start,
    extendedProps: { calendar },
    ...extra,
  });
  return [
    event("planning", "Monthly planning", `${day(1)}T09:30`, "work", {
      end: `${day(1)}T10:30`,
    }),
    event("design", "Design review", `${day(3)}T11:00`, "work", {
      end: `${day(3)}T12:00`,
    }),
    event("client", "Client check-in", `${day(4)}T15:00`, "work", {
      end: `${day(4)}T15:45`,
    }),
    event("workshop", "Product workshop", day(7), "team", {
      end: day(9),
      allDay: true,
    }),
    event("standup-1", "Team standup", `${day(9)}T10:00`, "team"),
    event("finance", "Finance sync", `${day(10)}T14:30`, "work", {
      end: `${day(10)}T15:00`,
    }),
    event("focus", "Focus block", `${day(12)}T09:00`, "focus", {
      end: `${day(12)}T12:00`,
      display: "background",
    }),
    event("sprint", "Sprint planning", `${day(15)}T09:30`, "team", {
      end: `${day(15)}T11:00`,
    }),
    event("standup-2", "Team standup", `${day(16)}T10:00`, "team"),
    event("ops", "Ops handoff", `${day(18)}T16:00`, "work", {
      end: `${day(18)}T16:45`,
    }),
    event("report", "Quarterly report due", day(24), "work", { allDay: true }),
    event("reset", "Reset day", day(28), "personal", { allDay: true }),
    event(
      "birthday",
      "Arham Khan Birthday",
      `${today.getFullYear()}-09-06`,
      "personal",
      { allDay: true },
    ),
  ];
}
