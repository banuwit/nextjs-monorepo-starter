import type { z } from "zod";
import type { calendars, calendarOwners } from "../utils/calendar";
import type { eventFormSchema } from "../schemas/calendar.schema";

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

export type EventForm = z.infer<typeof eventFormSchema>;
