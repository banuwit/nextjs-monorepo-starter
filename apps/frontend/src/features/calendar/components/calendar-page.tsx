"use client";

import { useEffect, useRef, useState } from "react";
import { useCalendarController } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import { differenceInCalendarDays, format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDemoEvents } from "@/mocks/calendar.mock";
import {
  calendars,
  countEventsInRange,
  filterEvents,
  type CalendarEvent,
  type CalendarId,
  type EventForm,
} from "../calendar-model";
import { EventCalendarViews } from "./event-calendar-views";
import { EventFormDialog } from "./event-form-dialog";

const views = [
  { value: "dayGridMonth", label: "Month" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
];
const calendarOptions = [
  { value: "all", label: "All calendars" },
  ...calendars,
];
const plugins = [dayGridPlugin, timeGridPlugin];

function Calendar() {
  const controller = useCalendarController();
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    createDemoEvents(new Date()),
  );
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarId | "all">(
    "all",
  );
  const [range, setRange] = useState<{
    title: string;
    start: Date;
    end: Date;
    days: number;
  } | null>(null);
  const [draft, setDraft] = useState<EventForm | null>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const visibleEvents = filterEvents(events, selectedCalendar);
  const count = range
    ? countEventsInRange(visibleEvents, range.start, range.end)
    : 0;

  return (
    <>
      <section
        aria-label="Event calendar"
        className="flex min-w-0 flex-col overflow-hidden rounded-md border"
      >
        <div className="flex flex-col gap-4 border-b bg-sidebar p-4 text-sidebar-foreground lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex min-w-0 shrink-0 flex-col gap-1"
            aria-live="polite"
          >
            <h1 className="text-lg leading-none font-medium">
              {range?.title ?? format(new Date(), "MMMM yyyy")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {range?.days ?? 0} days - {count} events
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={selectedCalendar}
              items={calendarOptions}
              onValueChange={(value) => {
                if (value) setSelectedCalendar(value as CalendarId | "all");
              }}
            >
              <SelectTrigger
                aria-label="Filter calendars"
                className="w-full sm:w-44"
              >
                <CalendarIcon />
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                <SelectGroup>
                  {calendarOptions.map((calendar) => (
                    <SelectItem key={calendar.value} value={calendar.value}>
                      {calendar.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <ButtonGroup aria-label="Calendar navigation">
              <Button
                size="icon"
                variant="outline"
                aria-label="Previous period"
                onClick={() => controller.prev()}
              >
                <ChevronLeftIcon />
              </Button>
              <Button variant="outline" onClick={() => controller.today()}>
                Today
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="Next period"
                onClick={() => controller.next()}
              >
                <ChevronRightIcon />
              </Button>
            </ButtonGroup>
            <Select
              value={controller.view?.type ?? "dayGridMonth"}
              items={views}
              onValueChange={(value) => {
                if (value) controller.changeView(value);
              }}
            >
              <SelectTrigger aria-label="Calendar view">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                <SelectGroup>
                  {views.map((view) => (
                    <SelectItem key={view.value} value={view.value}>
                      {view.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              ref={addButton}
              onClick={() => {
                const day = format(
                  controller.getDate() ?? new Date(),
                  "yyyy-MM-dd",
                );
                setDraft({
                  title: "",
                  calendar:
                    selectedCalendar === "all" ? "work" : selectedCalendar,
                  allDay: false,
                  start: `${day}T09:00`,
                  end: `${day}T10:00`,
                });
              }}
            >
              <PlusIcon data-icon="inline-start" />
              Add event
            </Button>
          </div>
        </div>
        <EventCalendarViews
          controller={controller}
          initialView="dayGridMonth"
          plugins={plugins}
          events={visibleEvents}
          nowIndicator
          popoverCloseContent={() => (
            <XIcon className="size-5 text-muted-foreground group-hover:text-foreground" />
          )}
          datesSet={(info) => {
            setRange({
              title: info.view.title,
              start: info.start,
              end: info.end,
              days: differenceInCalendarDays(
                info.view.currentEnd,
                info.view.currentStart,
              ),
            });
          }}
        />
      </section>
      <p className="text-xs text-muted-foreground">
        Demo calendar · Changes reset when this page is reloaded.
      </p>
      {draft && (
        <EventFormDialog
          initialValue={draft}
          finalFocus={addButton}
          onClose={() => setDraft(null)}
          onSave={(event) => {
            setEvents((current) => [...current, event]);
            setDraft(null);
          }}
        />
      )}
    </>
  );
}

export function CalendarPage() {
  const [ready, setReady] = useState(false);
  // Initialize in the browser so demo dates and "today" use the user's timezone.
  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <AppBody>
      {ready ? (
        <Calendar />
      ) : (
        <div
          role="status"
          className="min-h-96 rounded-md border p-4 text-sm text-muted-foreground"
        >
          Loading calendar…
        </div>
      )}
    </AppBody>
  );
}
