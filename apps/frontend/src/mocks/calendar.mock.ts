import { addDays, format, startOfWeek } from "date-fns";
import type {
  CalendarEvent,
  CalendarId,
} from "@/features/calendar/types/calendar";

// Keep the sample schedule in the opening week, including month/year boundaries.
export function createDemoEvents(today: Date): CalendarEvent[] {
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const day = (offset: number) => format(addDays(monday, offset), "yyyy-MM-dd");
  const event = (
    id: string,
    title: string,
    offset: number,
    start: string | null,
    end: string | null,
    calendar: CalendarId,
    details: Omit<CalendarEvent["extendedProps"], "calendar"> = {},
  ): CalendarEvent => ({
    id,
    title,
    start: start ? `${day(offset)}T${start}` : day(offset),
    end: end ? `${day(offset)}T${end}` : day(offset + 1),
    allDay: !start,
    extendedProps: { calendar, owner: "me", ...details },
  });
  return [
    event("launch", "Website launch checklist", 0, null, null, "work", {
      progress: { completed: 7, total: 8 },
      description:
        "Final checks for the new website: content, accessibility, and release readiness.",
    }),
    event("handoff", "Design handoff", 2, null, null, "team", {
      owner: "alex",
      progress: { completed: 4, total: 6 },
      description:
        "Prepare the approved screens and interaction notes for the engineering team.",
    }),
    event("report", "Monthly report due", 4, null, null, "work", {
      owner: "sarah",
      progress: { completed: 3, total: 5 },
      description:
        "Review the monthly results and share the final summary with the team.",
    }),
    event("planning", "Weekly planning", 0, "09:00", "10:30", "work", {
      location: "Meeting room A",
      progress: { completed: 2, total: 4 },
    }),
    event("standup", "Team standup", 0, "13:00", "14:00", "team", {
      owner: "alex",
      location: "Google Meet",
    }),
    event("client", "Client check-in", 1, "10:00", "11:30", "work", {
      owner: "sarah",
      location: "Google Meet",
      description: "Share the latest delivery updates and confirm next steps.",
    }),
    event("focus", "Product research", 1, "14:00", "16:00", "focus", {
      location: "Focus time",
      description: "Uninterrupted time for research and planning.",
    }),
    event("design", "Design review", 2, "09:00", "10:30", "team", {
      owner: "alex",
      location: "Design studio",
    }),
    event("walk", "Lunch & a walk", 2, "12:00", "13:00", "personal"),
    event("sprint", "Sprint planning", 3, "10:00", "11:30", "team", {
      owner: "alex",
      progress: { completed: 3, total: 6 },
    }),
    event("finance", "Finance sync", 3, "14:00", "15:30", "work", {
      owner: "sarah",
      location: "Meeting room B",
    }),
    event("retro", "Weekly retrospective", 4, "09:00", "10:30", "team", {
      location: "Google Meet",
    }),
    event("learning", "Learning & development", 4, "14:00", "16:00", "focus", {
      description:
        "Work through this week's learning goals and document useful takeaways.",
    }),
  ];
}
