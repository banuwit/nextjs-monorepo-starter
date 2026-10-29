"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserFilter, UserFilterField } from "../types/user-sheet-filters";

/** The filter row lives inside each header, matching the spreadsheet example. */
export function SheetColumnFilter({
  field,
  title,
  options,
  value,
  onChange,
}: {
  field: UserFilterField;
  title: string;
  options?: string[];
  value: string;
  onChange: (filter: UserFilter) => void;
}) {
  if (options)
    return (
      <Select
        value={value || "__any"}
        onValueChange={(next) =>
          onChange({
            field,
            operator: "equals",
            value: !next || next === "__any" ? "" : next,
          })
        }
        items={[
          { value: "__any", label: `Any ${title.toLowerCase()}` },
          ...options.map((option) => ({
            value: option,
            label: option[0]!.toUpperCase() + option.slice(1),
          })),
        ]}
      >
        <SelectTrigger
          aria-label={`Filter ${title}`}
          className="h-8 w-full min-w-0 text-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          <SelectItem value="__any">Any {title.toLowerCase()}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option[0]!.toUpperCase() + option.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  return (
    <Input
      aria-label={`Filter ${title}`}
      type={field === "joinDate" ? "date" : "text"}
      placeholder={`Any ${title.toLowerCase()}`}
      className="h-8 min-w-0 text-xs"
      value={value}
      onChange={(event) =>
        onChange({
          field,
          operator: field === "joinDate" ? "equals" : "contains",
          value: event.target.value,
        })
      }
    />
  );
}
