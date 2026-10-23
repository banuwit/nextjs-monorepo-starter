import { addDays, format, parseISO } from "date-fns";
import type {
  CalendarOwner,
  CalendarId,
  CalendarEvent,
  EventForm,
} from "../types/calendar";
import { eventFormSchema } from "../schemas/calendar.schema";

export const calendars = [
  { value: "work", label: "Work", color: "var(--calendar-work)" },
  { value: "personal", label: "Personal", color: "var(--calendar-personal)" },
  { value: "team", label: "Team", color: "var(--calendar-team)" },
  { value: "focus", label: "Focus time", color: "var(--calendar-focus)" },
] as const;

export const calendarOwners = [
  { value: "me", label: "Me" },
  { value: "alex", label: "Alex Morgan" },
  { value: "sarah", label: "Sarah Chen" },
] as const;

export function createCalendarEvent(
  input: EventForm,
  id: string,
): CalendarEvent {
  const value = eventFormSchema.parse(input);
  return {
    id,
    title: value.title,
    start: value.start,
    // FullCalendar's all-day end is exclusive; the form's end is inclusive.
    end: value.allDay
      ? format(addDays(parseISO(value.end), 1), "yyyy-MM-dd")
      : value.end,
    allDay: value.allDay,
    extendedProps: { calendar: value.calendar, owner: value.owner },
  };
}

export function filterEvents(
  events: CalendarEvent[],
  calendar: CalendarId | "all",
  owner: CalendarOwner | "all" = "all",
) {
  return events.filter(
    (event) =>
      (calendar === "all" || event.extendedProps.calendar === calendar) &&
      (owner === "all" || (event.extendedProps.owner ?? "me") === owner),
  );
}

export function countEventsInRange(
  events: CalendarEvent[],
  start: Date,
  end: Date,
) {
  return events.filter((event) => {
    const eventStart = parseISO(event.start);
    const eventEnd = event.end
      ? parseISO(event.end)
      : event.allDay
        ? addDays(eventStart, 1)
        : eventStart;
    return eventStart < end && (eventEnd > start || eventStart >= start);
  }).length;
}
