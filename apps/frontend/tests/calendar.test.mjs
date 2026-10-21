import assert from "node:assert/strict";
import { test } from "node:test";
import { addDays, startOfWeek } from "date-fns";
import { createDemoEvents } from "../src/mocks/calendar.mock.ts";
import {
  eventFormSchema,
  filterEvents,
  countEventsInRange,
  createCalendarEvent,
} from "../src/features/calendar/calendar-model.ts";

const draft = {
  title: "Planning",
  calendar: "work",
  start: "2026-10-17T09:00",
  end: "2026-10-17T10:00",
  allDay: false,
};

test("calendar form rejects blank titles, invalid dates, and reversed ranges", () => {
  assert.equal(eventFormSchema.safeParse(draft).success, true);
  for (const patch of [
    { title: " " },
    { calendar: "unknown" },
    { owner: "unknown" },
    { start: "invalid" },
    { start: "2026-02-30T09:00" },
    { end: draft.start },
    { end: "2026-10-16T10:00" },
  ]) {
    assert.equal(
      eventFormSchema.safeParse({ ...draft, ...patch }).success,
      false,
    );
  }
});

test("demo events stay in the opening week across a year boundary", () => {
  const today = new Date(2027, 0, 1);
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const events = createDemoEvents(today);
  assert.equal(
    countEventsInRange(events, start, addDays(start, 7)),
    events.length,
  );
  assert.ok(events.some((event) => event.allDay));
  assert.ok(events.some((event) => !event.allDay));
});

test("all-day events include the chosen last day with an exclusive calendar end", () => {
  const event = createCalendarEvent(
    {
      ...draft,
      title: " Trip ",
      start: "2026-10-17",
      end: "2026-10-18",
      allDay: true,
    },
    "trip",
  );
  assert.equal(event.title, "Trip");
  assert.equal(event.start, "2026-10-17");
  assert.equal(event.end, "2026-10-19");
  assert.equal(event.id, "trip");
});

test("timed events preserve local wall-clock time", () => {
  const event = createCalendarEvent(draft, "planning");
  assert.equal(event.start, draft.start);
  assert.equal(event.end, draft.end);
});

test("calendar and ownership filters combine without dropping newly created events", () => {
  const events = [
    createCalendarEvent({ ...draft, owner: "me" }, "mine"),
    createCalendarEvent({ ...draft, owner: "alex" }, "alex-work"),
    createCalendarEvent(
      { ...draft, calendar: "team", owner: "alex" },
      "alex-team",
    ),
  ];
  assert.equal(events[0].extendedProps.owner, "me");
  assert.deepEqual(
    filterEvents(events, "work", "alex").map((event) => event.id),
    ["alex-work"],
  );
  assert.equal(filterEvents(events, "all", "alex").length, 2);
  assert.equal(filterEvents(events, "all", "all").length, 3);
  assert.equal(filterEvents(events, "all", "sarah").length, 0);
});

test("filter and count include overlapping events but exclude an exclusive end boundary", () => {
  const events = [
    createCalendarEvent(draft, "work"),
    createCalendarEvent({ ...draft, calendar: "personal" }, "personal"),
    createCalendarEvent(
      { ...draft, start: "2026-10-16", end: "2026-10-17", allDay: true },
      "overlap",
    ),
    createCalendarEvent(
      { ...draft, start: "2026-10-16", end: "2026-10-16", allDay: true },
      "before",
    ),
  ];
  const work = filterEvents(events, "work");
  assert.equal(work.length, 3);
  assert.equal(filterEvents(events, "all").length, 4);
  assert.equal(
    countEventsInRange(work, new Date(2026, 9, 17), new Date(2026, 9, 18)),
    2,
  );
  assert.equal(events.length, 4);
});
