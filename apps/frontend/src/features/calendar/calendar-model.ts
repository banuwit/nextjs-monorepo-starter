import { addDays, format, isValid, parseISO } from "date-fns";
import { z } from "zod";

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

export type CalendarOwner = (typeof calendarOwners)[number]["value"];
export type CalendarId = (typeof calendars)[number]["value"];
export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  display?: "background";
  extendedProps: {
    calendar: CalendarId;
    owner?: CalendarOwner;
    location?: string;
    description?: string;
    progress?: { completed: number; total: number };
  };
};

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Enter an event title.").max(120),
    calendar: z.enum(["work", "personal", "team", "focus"]),
    owner: z.enum(["me", "alex", "sarah"]).default("me"),
    start: z
      .string()
      .refine((value) => isValid(parseISO(value)), "Enter a valid start date."),
    end: z
      .string()
      .refine((value) => isValid(parseISO(value)), "Enter a valid end date."),
    allDay: z.boolean(),
  })
  .superRefine((value, ctx) => {
    const pattern = value.allDay
      ? /^\d{4}-\d{2}-\d{2}$/
      : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    for (const field of ["start", "end"] as const) {
      if (!pattern.test(value[field]))
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: "Enter a valid date and time.",
        });
    }
    const start = parseISO(value.start).getTime();
    const end = parseISO(value.end).getTime();
    if (value.allDay ? end < start : end <= start) {
      ctx.addIssue({
        code: "custom",
        path: ["end"],
        message: value.allDay
          ? "End date must be on or after the start date."
          : "End time must be after the start time.",
      });
    }
  });

export type EventForm = z.infer<typeof eventFormSchema>;

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
