"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import type { SelectOption } from "./types";

/** Sentinel for the "all" entry; Base UI treats `null` as "no value". */
const ALL_VALUE = "__all__";

export interface SelectFilterProps {
  /** Options sharing `group` render together under that heading. */
  options: SelectOption[];
  value: string | null;
  /** Fires immediately with the picked value, or `null` for "all". */
  onValueChange: (value: string | null) => void;
  /** Trigger text when nothing is picked, e.g. "Role". */
  placeholder?: string;
  /** Label of the entry that clears the filter. Default: "All". */
  allLabel?: string;
  className?: string;
  /**
   * Classes for the popup. The list scrolls (with scroll arrows) once it
   * outgrows `max-h-72` or the space left in the viewport, whichever is less.
   */
  contentClassName?: string;
  disabled?: boolean;
}

/**
 * A plain single-pick filter on shadcn `Select`, without search, for lists
 * read rather than typed at. The first entry clears the filter, so no
 * separate reset control is needed.
 */
export function SelectFilter({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  allLabel = "All",
  className,
  contentClassName,
  disabled = false,
}: SelectFilterProps) {
  const items = [
    { label: allLabel, value: ALL_VALUE },
    ...options.map(({ label, value }) => ({ label, value })),
  ];

  /** Options in source order, split into groups; ungrouped ones come first. */
  const groups = React.useMemo(() => {
    const ordered: { name?: string; options: SelectOption[] }[] = [];
    const byName = new Map<string | undefined, SelectOption[]>();

    options.forEach((option) => {
      let bucket = byName.get(option.group);

      if (!bucket) {
        bucket = [];
        byName.set(option.group, bucket);
        ordered.push({ name: option.group, options: bucket });
      }

      bucket.push(option);
    });

    return ordered;
  }, [options]);

  return (
    <Select
      items={items}
      value={value ?? null}
      disabled={disabled}
      onValueChange={(next) =>
        onValueChange(!next || next === ALL_VALUE ? null : next)
      }
    >
      <SelectTrigger
        aria-label={placeholder}
        className={cn(
          // Same resting look as the outline button behind FacetedFilter.
          "min-w-32 border-border bg-background text-foreground hover:bg-muted aria-expanded:bg-muted data-placeholder:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 dark:aria-expanded:bg-input/50 [&_svg]:text-foreground",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        alignItemWithTrigger={false}
        align="start"
        className={cn(
          "max-h-[min(18rem,var(--available-height))]",
          contentClassName,
        )}
      >
        {/* Grouped like the options so every row gets the same `p-1` inset. */}
        <SelectGroup>
          <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
        </SelectGroup>
        {groups.map((group, index) => (
          <React.Fragment key={group.name ?? `__ungrouped-${index}`}>
            {/* The popup itself has no padding to pull the rule back into. */}
            <SelectSeparator className="mx-0 my-0" />
            <SelectGroup>
              {group.name && <SelectLabel>{group.name}</SelectLabel>}
              {group.options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.icon && (
                    <option.icon className="text-muted-foreground" />
                  )}
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  );
}
