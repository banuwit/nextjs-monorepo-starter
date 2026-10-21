import type { CSSProperties } from "react";
import type { EventDisplayInfo } from "@fullcalendar/react";
import { format, isSameDay, subDays } from "date-fns";
import {
  ClockIcon,
  ListTodoIcon,
  MapPinIcon,
  UserRoundIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  calendars,
  calendarOwners,
  type CalendarEvent,
} from "../calendar-model";

export function CalendarEventCard({ info }: { info: EventDisplayInfo }) {
  const details = info.event.extendedProps as CalendarEvent["extendedProps"];
  const category =
    calendars.find((item) => item.value === details.calendar) ?? calendars[0];
  const owner = calendarOwners.find(
    (item) => item.value === (details.owner ?? "me"),
  );
  const compact =
    info.view.type === "dayGridMonth" || info.view.type === "listWeek";
  const progress = details.progress;
  const style = { "--event-accent": category.color } as CSSProperties;
  const lastDay =
    info.event.end &&
    (info.event.allDay ? subDays(info.event.end, 1) : info.event.end);
  const time = info.event.allDay
    ? "All day"
    : [info.event.start, info.event.end]
        .filter((date) => date !== null)
        .map((date) => format(date, "h:mm a"))
        .join(" – ");

  return (
    <Popover>
      <PopoverTrigger
        render={<button type="button" className="calendar-event-card" />}
        openOnHover
        delay={350}
        style={style}
        aria-label={`${info.event.title}, ${time}`}
      >
        {compact ? (
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="calendar-event-dot" aria-hidden="true" />
            <span className="truncate font-medium">{info.event.title}</span>
          </span>
        ) : (
          <>
            <Badge
              variant="secondary"
              className="calendar-event-category ml-auto max-w-full rounded-sm"
            >
              {category.label}
            </Badge>
            <span
              className={cn(
                "font-medium",
                info.isShort ? "truncate" : "line-clamp-2",
              )}
            >
              {info.event.title}
            </span>
            {info.isShort ? null : progress ? (
              <>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <ListTodoIcon
                    className="size-3 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="truncate">Tasks</span>
                  <span className="ml-auto tabular-nums">
                    {progress.completed}/{progress.total}
                  </span>
                </span>
                {info.event.allDay && (
                  <Progress
                    value={(progress.completed / progress.total) * 100}
                    aria-label={`${info.event.title} tasks`}
                  />
                )}
              </>
            ) : details.location ? (
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPinIcon className="size-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{details.location}</span>
              </span>
            ) : null}
          </>
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="calendar-event-details w-80 max-w-[calc(100vw-2rem)] gap-4"
        style={style}
      >
        <PopoverHeader>
          <Badge variant="secondary" className="calendar-event-category mb-2">
            {category.label}
          </Badge>
          <PopoverTitle>{info.event.title}</PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <ClockIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              {info.event.start && format(info.event.start, "EEEE, MMMM d")}
              {info.event.start &&
                lastDay &&
                !isSameDay(info.event.start, lastDay) &&
                ` – ${format(lastDay, "EEEE, MMMM d")}`}
              <br />
              {time}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <UserRoundIcon className="size-4" aria-hidden="true" />
            {owner?.label ?? "Me"}
          </p>
          {details.location && (
            <p className="flex items-center gap-2">
              <MapPinIcon className="size-4" aria-hidden="true" />
              {details.location}
            </p>
          )}
        </div>
        {details.description && (
          <p className="text-sm">{details.description}</p>
        )}
        {progress && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {progress.completed} of {progress.total} tasks complete
            </p>
            <Progress
              value={(progress.completed / progress.total) * 100}
              aria-label="Tasks complete"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
