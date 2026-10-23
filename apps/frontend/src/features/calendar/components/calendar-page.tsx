"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useCalendarController } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import { format } from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createDemoEvents } from "@/mocks/calendar.mock";
import {
  calendars,
  calendarOwners,
  countEventsInRange,
  filterEvents,
} from "../utils/calendar";
import type {
  CalendarEvent,
  CalendarId,
  CalendarOwner,
  EventForm,
} from "../types/calendar";
import { CalendarEventCard } from "./calendar-event-card";
import { EventCalendarViews } from "./event-calendar-views";
import { EventFormDialog } from "./event-form-dialog";
import "./calendar.css";

const views = [
  { value: "dayGridMonth", label: "Month" },
  { value: "timeGridWeek", label: "Week" },
  { value: "timeGridDay", label: "Day" },
  { value: "listWeek", label: "Agenda" },
];
const calendarOptions = [
  { value: "all", label: "Category · All" },
  ...calendars,
];
const ownerOptions = [
  { value: "all", label: "Ownership · All" },
  ...calendarOwners,
];
const plugins = [dayGridPlugin, timeGridPlugin, listPlugin];

function Calendar() {
  const controller = useCalendarController();
  const [initialView] = useState(() =>
    window.matchMedia("(max-width: 639px)").matches
      ? "timeGridDay"
      : "timeGridWeek",
  );
  const [events, setEvents] = useState<CalendarEvent[]>(() =>
    createDemoEvents(new Date()),
  );
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarId | "all">(
    "all",
  );
  const [selectedOwner, setSelectedOwner] = useState<CalendarOwner | "all">(
    "all",
  );
  const [range, setRange] = useState<{
    title: string;
    start: Date;
    end: Date;
  } | null>(null);
  const [draft, setDraft] = useState<EventForm | null>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const visibleEvents = filterEvents(events, selectedCalendar, selectedOwner);
  const count = range
    ? countEventsInRange(visibleEvents, range.start, range.end)
    : 0;
  const activeView = controller.view?.type ?? initialView;

  return (
    <>
      <section
        aria-label="Event calendar"
        className="event-calendar flex min-w-0 flex-col overflow-hidden rounded-xl border bg-background"
      >
        <div className="flex items-center justify-between gap-4 border-b px-4 py-3.5 sm:px-5">
          <h1 className="text-lg font-semibold">Calendar</h1>
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
                owner: selectedOwner === "all" ? "me" : selectedOwner,
                allDay: false,
                start: `${day}T09:00`,
                end: `${day}T10:00`,
              });
            }}
          >
            <PlusIcon data-icon="inline-start" />
            New event
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b p-3 sm:px-4">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Button variant="ghost" onClick={() => controller.today()}>
              Today
            </Button>
            <Select
              value={activeView}
              items={views}
              onValueChange={(value) => {
                if (value) controller.changeView(value);
              }}
            >
              <SelectTrigger
                aria-label="Calendar view"
                className="w-24 border-transparent"
              >
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
            <div
              role="group"
              aria-label="Calendar navigation"
              className="flex items-center"
            >
              <Button
                size="icon"
                variant="ghost"
                aria-label="Previous period"
                onClick={() => controller.prev()}
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Next period"
                onClick={() => controller.next()}
              >
                <ChevronRightIcon />
              </Button>
            </div>
            <p
              aria-live="polite"
              className="w-full px-2 pt-1 text-sm font-semibold sm:ml-2 sm:w-auto sm:p-0"
            >
              {range?.title ?? format(new Date(), "MMMM yyyy")}
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
              <SelectTrigger aria-label="Filter calendars" className="min-w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" alignItemWithTrigger={false}>
                <SelectGroup>
                  {calendarOptions.map((calendar) => (
                    <SelectItem key={calendar.value} value={calendar.value}>
                      {calendar.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              value={selectedOwner}
              items={ownerOptions}
              onValueChange={(value) => {
                if (value) setSelectedOwner(value as CalendarOwner | "all");
              }}
            >
              <SelectTrigger aria-label="Filter ownership" className="min-w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" alignItemWithTrigger={false}>
                <SelectGroup>
                  {ownerOptions.map((owner) => (
                    <SelectItem key={owner.value} value={owner.value}>
                      {owner.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="min-w-0 overflow-x-auto">
          <div
            className={cn(
              (activeView === "timeGridWeek" ||
                activeView === "dayGridMonth") &&
                "min-w-180",
            )}
          >
            <EventCalendarViews
              controller={controller}
              initialView={initialView}
              plugins={plugins}
              events={visibleEvents.map((event) => ({
                ...event,
                color: calendars.find(
                  (calendar) => calendar.value === event.extendedProps.calendar,
                )?.color,
              }))}
              height="max(34rem, calc(100svh - 15rem))"
              firstDay={1}
              nowIndicator
              eventDisplay="block"
              eventShortHeight={80}
              eventInteractive={false}
              eventContent={(info) => <CalendarEventCard info={info} />}
              eventInnerClass="h-full min-w-0"
              blockEventClass="overflow-hidden border border-[color-mix(in_oklab,var(--fc-event-color)_30%,var(--border))] bg-[color-mix(in_oklab,var(--fc-event-color)_12%,var(--background))] hover:bg-[color-mix(in_oklab,var(--fc-event-color)_20%,var(--background))]"
              blockEventInnerClass="h-full min-w-0"
              columnEventClass="mx-0.5 my-px rounded-md"
              columnEventInnerClass="h-full min-w-0"
              rowEventInnerClass="min-w-0"
              slotDuration="01:00:00"
              slotMinTime="00:00:00"
              slotMaxTime="24:00:00"
              scrollTime="08:00:00"
              slotMinHeight={64}
              slotHeaderFormat={{
                hour: "numeric",
                meridiem: "short",
                omitZeroMinute: true,
              }}
              dayHeaderFormat={{ weekday: "short", day: "numeric" }}
              dayHeaderClass="justify-start border"
              dayHeaderInnerClass={(info) =>
                cn(
                  "m-1.5 rounded-sm px-1.5 py-1 text-xs",
                  info.isToday &&
                    "bg-primary/10 font-semibold text-primary-text",
                )
              }
              dayHeaderContent={(info) => <>{info.text}</>}
              popoverCloseContent={() => (
                <XIcon className="size-5 text-muted-foreground" />
              )}
              views={{
                timeGrid: {
                  titleFormat: {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                  dayHeaderAlign: "start",
                  dayLaneInnerClass: "mx-0.5",
                  allDayText: "All day",
                  allDayDividerClass: "border-b",
                  allDayHeaderInnerClass: "p-2 text-xs text-muted-foreground",
                  rowEventClass: "mx-1 my-1 rounded-md",
                  rowEventInnerClass: "min-w-0",
                },
                dayGrid: {
                  dayHeaderFormat: { weekday: "short" },
                  dayMaxEvents: 3,
                  rowEventClass: "mx-1 mb-1 rounded-md",
                  rowEventInnerClass: "min-w-0",
                },
                list: {
                  titleFormat: {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                },
              }}
              datesSet={(info) =>
                setRange({
                  title: info.view.title,
                  start: info.start,
                  end: info.end,
                })
              }
            />
          </div>
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>Demo calendar · Changes reset when this page is reloaded.</p>
        <p role="status">
          {count} {count === 1 ? "event" : "events"} in this view
        </p>
      </div>
      {draft && (
        <EventFormDialog
          initialValue={draft}
          finalFocus={addButton}
          onClose={() => setDraft(null)}
          onSave={(event) => {
            setEvents((current) => [...current, event]);
            controller.gotoDate(event.start);
            setDraft(null);
          }}
        />
      )}
    </>
  );
}

const subscribe = () => () => {};

export function CalendarPage() {
  // Browser-only initialization; the server and hydration render the fallback.
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return (
    <AppBody>
      {ready ? (
        <Calendar />
      ) : (
        <div
          role="status"
          className="min-h-96 rounded-xl border bg-background p-4 text-sm text-muted-foreground"
        >
          Loading calendar…
        </div>
      )}
    </AppBody>
  );
}
