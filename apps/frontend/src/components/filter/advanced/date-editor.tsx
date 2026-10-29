"use client";

import { useState } from "react";

import {
  formatFilterDate,
  parseFilterDate,
  resolveFilterDate,
  toFilterDateValue,
  type FilterDateValue,
} from "@/components/reui/filters/filters-date";
import type {
  FilterEditorProps,
  FilterField,
  FilterOperator,
} from "@/components/reui/filters/filters-types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

/** One day, or a `[from, to]` span for the range operators. */
export type DateValue = FilterDateValue | [FilterDateValue, FilterDateValue];

const isRange = (
  value: DateValue | undefined,
): value is [FilterDateValue, FilterDateValue] => Array.isArray(value);

const DAY_GRID =
  "p-0 [--cell-size:--spacing(7)] [&_.rdp-month]:gap-2 [&_tbody_tr]:mt-1";

/** Typed phrase ("next friday", "3 days ago") or a calendar click. */
function SingleDateBody({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  field,
}: FilterEditorProps<DateValue>) {
  const current = isRange(value) ? value[0] : value;
  const [text, setText] = useState(() => formatFilterDate(current));
  const selected = resolveFilterDate(current) ?? undefined;

  return (
    <div className="flex flex-col gap-2 p-2">
      <Input
        {...autoFocusProps}
        value={text}
        placeholder="today, next friday, 3 days ago..."
        aria-label={field.label}
        onChange={(event) => {
          setText(event.target.value);
          const parsed = parseFilterDate(event.target.value);
          if (parsed) onValueChange(parsed);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit(parseFilterDate(text) ?? current);
          }
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            cancel();
          }
        }}
      />
      <Calendar
        mode="single"
        className={DAY_GRID}
        selected={selected}
        defaultMonth={selected}
        onSelect={(date) => {
          if (date) commit(toFilterDateValue(date));
        }}
      />
    </div>
  );
}

const RANGE_PRESETS: [string, [FilterDateValue, FilterDateValue]][] = [
  [
    "Last 7 days",
    [
      { relative: { unit: "day", offset: -6 } },
      { relative: { unit: "day", offset: 0 } },
    ],
  ],
  [
    "Last 30 days",
    [
      { relative: { unit: "day", offset: -29 } },
      { relative: { unit: "day", offset: 0 } },
    ],
  ],
];

/** Two-month calendar with presets; Apply commits the span. */
function DateRangeBody({
  value,
  onValueChange,
  commit,
  cancel,
  autoFocusProps,
  labels,
}: FilterEditorProps<DateValue>) {
  const tuple = isRange(value) ? value : undefined;
  const from = resolveFilterDate(tuple?.[0]) ?? undefined;
  const to = resolveFilterDate(tuple?.[1]) ?? undefined;

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="grid grid-cols-2 gap-1.5">
        {RANGE_PRESETS.map(([label, preset], index) => (
          <Button
            key={label}
            {...(index === 0 ? autoFocusProps : {})}
            variant="outline"
            size="sm"
            onClick={() => commit(preset)}
          >
            {label}
          </Button>
        ))}
      </div>
      <Calendar
        mode="range"
        numberOfMonths={2}
        className={DAY_GRID}
        selected={{ from, to }}
        defaultMonth={from}
        onSelect={(range) => {
          if (!range?.from) return;
          onValueChange([
            toFilterDateValue(range.from),
            toFilterDateValue(range.to ?? range.from),
          ]);
        }}
      />
      <div className="-mx-2 flex items-center justify-end gap-1.5 border-t px-2 pt-2">
        <Button variant="ghost" size="sm" onClick={cancel}>
          {labels.discard}
        </Button>
        <Button size="sm" disabled={!tuple} onClick={() => commit()}>
          {labels.apply}
        </Button>
      </div>
    </div>
  );
}

function DateEditor(props: FilterEditorProps<DateValue>) {
  return props.operator.arity === "range" ? (
    <DateRangeBody {...props} />
  ) : (
    <SingleDateBody {...props} />
  );
}

const DATE_OPERATORS: FilterOperator[] = [
  { value: "is", label: "is", inverse: "is_not" },
  { value: "is_not", label: "is not", inverse: "is" },
  { value: "is_before", label: "is before", inverse: "is_on_or_after" },
  { value: "is_after", label: "is after", inverse: "is_on_or_before" },
  { value: "is_on_or_before", label: "is on or before", inverse: "is_after" },
  { value: "is_on_or_after", label: "is on or after", inverse: "is_before" },
  {
    value: "between",
    label: "is between",
    arity: "range",
    inverse: "not_between",
  },
  {
    value: "not_between",
    label: "is not between",
    arity: "range",
    inverse: "between",
  },
];

const dateText = (
  value: unknown,
  valueRange: (from: string, to: string) => string,
) => {
  const typed = value as DateValue | undefined;
  if (isRange(typed)) {
    return valueRange(formatFilterDate(typed[0]), formatFilterDate(typed[1]));
  }
  return formatFilterDate(typed) || "any day";
};

/** A date field: single-day and range operators sharing one editor (c-filters-5). */
export function createDateField(
  field: Pick<FilterField, "id" | "label" | "icon" | "keywords" | "column"> & {
    defaultOperator: string;
  },
): FilterField {
  return {
    ...field,
    operators: DATE_OPERATORS,
    editor: DateEditor,
    renderValue: ({ value, labels }) => dateText(value, labels.valueRange),
    valueText: ({ value, labels }) => dateText(value, labels.valueRange),
  };
}
