"use client";

import { useState } from "react";
import { CrudDialog } from "@/components/crud/crud-dialog";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calendars,
  calendarOwners,
  createCalendarEvent,
} from "../utils/calendar";
import { eventFormSchema } from "../schemas/calendar.schema";
import type { CalendarEvent, EventForm } from "../types/calendar";

export function EventFormDialog({
  initialValue,
  onClose,
  onSave,
  finalFocus,
}: {
  initialValue: EventForm;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  finalFocus: React.RefObject<HTMLButtonElement | null>;
}) {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EventForm, string>>
  >({});
  return (
    <CrudDialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Add event"
      description="Create an event in your calendar. Demo changes last until this page is reloaded."
      finalFocus={finalFocus}
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const parsed = eventFormSchema.safeParse(value);
          if (!parsed.success) {
            setErrors(
              Object.fromEntries(
                parsed.error.issues.map((issue) => [
                  issue.path[0],
                  issue.message,
                ]),
              ),
            );
            return;
          }
          onSave(createCalendarEvent(parsed.data, crypto.randomUUID()));
        }}
      >
        <FieldGroup>
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="event-title">Title</FieldLabel>
            <Input
              id="event-title"
              autoFocus
              maxLength={120}
              value={value.title}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "event-title-error" : undefined}
              onChange={(event) =>
                setValue({ ...value, title: event.target.value })
              }
            />
            {errors.title && (
              <FieldError id="event-title-error">{errors.title}</FieldError>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="event-calendar">Calendar</FieldLabel>
            <Select
              items={calendars}
              value={value.calendar}
              onValueChange={(calendar) => {
                if (calendar) setValue({ ...value, calendar });
              }}
            >
              <SelectTrigger id="event-calendar" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {calendars.map((calendar) => (
                    <SelectItem key={calendar.value} value={calendar.value}>
                      {calendar.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="event-owner">Owner</FieldLabel>
            <Select
              items={calendarOwners}
              value={value.owner}
              onValueChange={(owner) => {
                if (owner) setValue({ ...value, owner });
              }}
            >
              <SelectTrigger id="event-owner" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {calendarOwners.map((owner) => (
                    <SelectItem key={owner.value} value={owner.value}>
                      {owner.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field orientation="horizontal">
            <Switch
              id="event-all-day"
              checked={value.allDay}
              onCheckedChange={(allDay) =>
                setValue({
                  ...value,
                  allDay,
                  start: allDay
                    ? value.start.slice(0, 10)
                    : `${value.start}T09:00`,
                  end: allDay ? value.end.slice(0, 10) : `${value.end}T10:00`,
                })
              }
            />
            <FieldLabel htmlFor="event-all-day">All day</FieldLabel>
          </Field>
          {(["start", "end"] as const).map((field) => (
            <Field key={field} data-invalid={!!errors[field]}>
              <FieldLabel htmlFor={`event-${field}`}>
                {field === "start" ? "Start" : "End"}
              </FieldLabel>
              <Input
                id={`event-${field}`}
                type={value.allDay ? "date" : "datetime-local"}
                value={value[field]}
                aria-invalid={!!errors[field]}
                aria-describedby={
                  errors[field] ? `event-${field}-error` : undefined
                }
                onChange={(event) =>
                  setValue({ ...value, [field]: event.target.value })
                }
              />
              {errors[field] && (
                <FieldError id={`event-${field}-error`}>
                  {errors[field]}
                </FieldError>
              )}
            </Field>
          ))}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save event</Button>
          </div>
        </FieldGroup>
      </form>
    </CrudDialog>
  );
}
