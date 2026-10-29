"use client";

import type { KeyboardEvent } from "react";

import type {
  FilterEditorProps,
  FilterField,
  FilterValueDisplayContext,
} from "@/components/reui/filters/filters-types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export type SliderScale = {
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
};

/** One slider for both `between` (two thumbs) and single-value operators. */
function createSliderEditor({ min, max, step, format }: SliderScale) {
  function SliderEditor({
    value,
    onValueChange,
    commit,
    cancel,
    labels,
    field,
    operator,
    autoFocusProps,
  }: FilterEditorProps<number | number[]>) {
    const dual = operator.arity === "range";
    const pair = Array.isArray(value) ? value : [min, max];
    const single = typeof value === "number" ? value : min;
    const current = dual ? pair : single;
    const reading = dual
      ? labels.valueRange(format(pair[0] ?? min), format(pair[1] ?? max))
      : format(single);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commit(current);
        return;
      }
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      cancel();
    };

    return (
      <div className="flex w-64 flex-col gap-2 p-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="min-w-0 truncate text-xs font-medium text-muted-foreground">
            {field.label}
          </span>
          <span className="shrink-0 text-sm font-medium tabular-nums">
            {reading}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {format(min)}
          </span>
          <Slider
            {...autoFocusProps}
            className="min-w-0 flex-1"
            value={dual ? pair : [single]}
            min={min}
            max={max}
            step={step}
            onValueChange={(next) => {
              const list = Array.isArray(next) ? next : [next];
              onValueChange(dual ? list : (list[0] ?? min));
            }}
            onKeyDown={onKeyDown}
          />
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {format(max)}
          </span>
        </div>
        <div className="flex items-center justify-end gap-1.5 pt-1">
          <Button variant="ghost" size="sm" onClick={cancel}>
            {labels.discard}
          </Button>
          <Button size="sm" onClick={() => commit(current)}>
            {labels.apply}
          </Button>
        </div>
      </div>
    );
  }

  return SliderEditor;
}

/** The closed chip's mini rail: where the span sits on the full scale. */
function MiniTrack({
  min,
  max,
  from,
  to,
}: {
  min: number;
  max: number;
  from: number;
  to: number;
}) {
  const span = max - min;
  const at = (value: number) =>
    span <= 0 || !Number.isFinite(value)
      ? 0
      : Math.min(Math.max((value - min) / span, 0), 1);
  const start = at(from);
  const end = Math.max(start, at(to));

  return (
    <span
      aria-hidden="true"
      className="relative inline-block h-1 w-8 shrink-0 rounded-full bg-muted"
    >
      <span
        className="absolute inset-y-0 rounded-full bg-primary"
        style={{ left: `${start * 100}%`, right: `${(1 - end) * 100}%` }}
      />
    </span>
  );
}

function readBand(
  { min, max, format }: SliderScale,
  { value, operator, labels }: FilterValueDisplayContext,
) {
  if (Array.isArray(value)) {
    const from = Number(value[0]);
    const to = Number(value[1]);
    return { from, to, text: labels.valueRange(format(from), format(to)) };
  }
  if (typeof value !== "number") return null;
  const upward = operator.value === "gte" || operator.value === "gt";
  return {
    from: upward ? value : min,
    to: upward ? max : value,
    text: format(value),
  };
}

/** A numeric field edited on a slider, drawn as a mini rail in the chip (c-filters-6). */
export function createSliderField(
  field: Pick<FilterField, "id" | "label" | "icon" | "keywords" | "column"> & {
    type: "range" | "number";
    defaultOperator: string;
    scale: SliderScale;
    empty: string;
  },
): FilterField {
  const { scale, empty, ...rest } = field;

  return {
    ...rest,
    editor: createSliderEditor(scale),
    renderValue: (context) => {
      const band = readBand(scale, context);
      if (!band) return empty;
      return (
        <span className="flex items-center gap-1.5">
          <MiniTrack
            min={scale.min}
            max={scale.max}
            from={band.from}
            to={band.to}
          />
          <span className="tabular-nums">{band.text}</span>
        </span>
      );
    },
    valueText: (context) => readBand(scale, context)?.text ?? empty,
  };
}
