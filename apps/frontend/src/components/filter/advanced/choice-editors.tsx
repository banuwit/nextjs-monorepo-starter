"use client";

import type {
  FilterEditorProps,
  FilterOption,
} from "@/components/reui/filters/filters-types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

/*
 * Shadcn form controls as value editors (pola `c-filters-8`). Each editor reads
 * its rows from the field's own `options`, so one editor serves any field.
 * Multi-pick editors commit per press and stay open (`close: false`);
 * single-pick editors close after the pick.
 */

const asArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(String) : [];

/** Single-select rules may hold `"x"` or `["x"]`; read either. */
const asSingle = (value: unknown): string | null =>
  typeof value === "string"
    ? value
    : Array.isArray(value) && typeof value[0] === "string"
      ? value[0]
      : null;

const ROW =
  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 leading-normal font-normal hover:bg-accent";

/** Multiselect as a row of toggle buttons. */
export function ToggleGroupEditor({
  value,
  onValueChange,
  commit,
  field,
}: FilterEditorProps<string[]>) {
  return (
    <div className="p-2">
      <ToggleGroup
        multiple
        variant="outline"
        spacing={0}
        aria-label={field.label}
        value={asArray(value)}
        onValueChange={(next) => {
          onValueChange(next);
          commit(next, { close: false });
        }}
      >
        {field.options?.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

/** Single select as radios; `description` becomes the hint line. */
export function RadioEditor({
  value,
  commit,
  field,
}: FilterEditorProps<string>) {
  return (
    <RadioGroup
      className="flex w-60 flex-col gap-0 p-1"
      aria-label={field.label}
      value={asSingle(value)}
      onValueChange={(next) => commit(String(next))}
    >
      {field.options?.map((option) => (
        <Label key={option.value} className={cn(ROW, "items-start")}>
          <RadioGroupItem value={option.value} className="mt-0.5" />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm">{option.label}</span>
            {option.description && (
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            )}
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}

/** Multiselect as a checklist with a live count and Clear. */
export function CheckboxListEditor({
  value,
  onValueChange,
  commit,
  labels,
  field,
}: FilterEditorProps<string[]>) {
  const current = asArray(value);
  const write = (next: string[]) => {
    onValueChange(next);
    commit(next, { close: false });
  };

  return (
    <div className="flex w-56 flex-col p-1">
      {field.options?.map((option) => (
        <Label key={option.value} className={ROW}>
          <Checkbox
            checked={current.includes(option.value)}
            onCheckedChange={(checked) =>
              write(
                checked
                  ? [...current, option.value]
                  : current.filter((item) => item !== option.value),
              )
            }
          />
          <span className="text-sm">{option.label}</span>
        </Label>
      ))}
      <div className="mt-1 flex items-center justify-between gap-2 border-t ps-2 pt-1">
        <span className="text-xs text-muted-foreground tabular-nums">
          {labels.valueCount(current.length)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={current.length === 0}
          onClick={() => write([])}
        >
          {labels.clear}
        </Button>
      </div>
    </div>
  );
}

/** Single select as the platform `<select>`; the empty entry clears it. */
export function NativeSelectEditor({
  value,
  commit,
  field,
}: FilterEditorProps<string>) {
  return (
    <div className="w-56 p-2">
      <NativeSelect
        className="w-full"
        aria-label={field.label}
        value={asSingle(value) ?? ""}
        onChange={(event) =>
          commit(event.target.value === "" ? undefined : event.target.value)
        }
      >
        <NativeSelectOption value="">
          Any {field.label.toLowerCase()}
        </NativeSelectOption>
        {field.options?.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}

/** Boolean as a switch that commits on flip. */
export function SwitchEditor({
  value,
  commit,
  field,
}: FilterEditorProps<boolean>) {
  return (
    <Label className="flex w-44 cursor-pointer items-center justify-between gap-3 p-2 font-normal">
      <span className="text-sm">{field.label}</span>
      <Switch
        checked={value === true}
        onCheckedChange={(checked) => commit(checked)}
        aria-label={field.label}
      />
    </Label>
  );
}

/** First pick plus "+N", for multiselects edited outside the menu. */
export function PickedLabels({
  options,
  empty,
}: {
  options: FilterOption[];
  empty: string;
}) {
  const [first] = options;
  if (!first) return <>{empty}</>;
  return (
    <span className="flex items-center gap-1.5">
      {first.label}
      {options.length > 1 && (
        <span className="text-xs text-muted-foreground tabular-nums">
          +{options.length - 1}
        </span>
      )}
    </span>
  );
}
