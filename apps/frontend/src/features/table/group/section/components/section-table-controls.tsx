"use client";

import { Filter, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { DataGridSearchInput } from "@/components/data-grid/data-grid-search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import {
  emptySectionFilters,
  sectionColumns,
  type SectionColumnId,
  type SectionFilters,
} from "../user-sections";

export type SectionDisplay = { compact: boolean; hidden: SectionColumnId[] };
export const defaultSectionDisplay: SectionDisplay = {
  compact: true,
  hidden: [],
};

export function SectionTableControls({
  filters,
  onFiltersChange,
  display,
  onDisplayChange,
  groupAction,
}: {
  filters: SectionFilters;
  onFiltersChange: (filters: SectionFilters) => void;
  display: SectionDisplay;
  onDisplayChange: (display: SectionDisplay) => void;
  groupAction: ReactNode;
}) {
  const count =
    Number(filters.gender !== "all") + Number(filters.status !== "all");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="mr-auto flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Group by</span>
        <Badge variant="secondary">Role</Badge>
      </div>
      <DataGridSearchInput
        placeholder="Search users..."
        value={filters.search}
        onChange={(search) => onFiltersChange({ ...filters, search })}
      />
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          <Filter />
          Filter{count > 0 && <Badge variant="secondary">{count}</Badge>}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-4">
          <PopoverTitle>Filter users</PopoverTitle>
          <label className="flex items-center justify-between gap-2">
            Gender
            <NativeSelect
              aria-label="Filter gender"
              value={filters.gender}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  gender: event.target.value as SectionFilters["gender"],
                })
              }
            >
              <NativeSelectOption value="all">All genders</NativeSelectOption>
              <NativeSelectOption value="male">Male</NativeSelectOption>
              <NativeSelectOption value="female">Female</NativeSelectOption>
            </NativeSelect>
          </label>
          <label className="flex items-center justify-between gap-2">
            Status
            <NativeSelect
              aria-label="Filter status"
              value={filters.status}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  status: event.target.value as SectionFilters["status"],
                })
              }
            >
              <NativeSelectOption value="all">All statuses</NativeSelectOption>
              <NativeSelectOption value="active">Active</NativeSelectOption>
              <NativeSelectOption value="inactive">Inactive</NativeSelectOption>
              <NativeSelectOption value="pending">Pending</NativeSelectOption>
            </NativeSelect>
          </label>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onFiltersChange(emptySectionFilters)}
          >
            Clear filters
          </Button>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          <Settings2 />
          Display
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="max-h-[75vh] w-72 overflow-y-auto p-4"
        >
          <PopoverTitle>Table display</PopoverTitle>
          <label className="flex items-center justify-between gap-2">
            Density
            <NativeSelect
              aria-label="Density"
              value={display.compact ? "compact" : "comfortable"}
              onChange={(event) =>
                onDisplayChange({
                  ...display,
                  compact: event.target.value === "compact",
                })
              }
            >
              <NativeSelectOption value="compact">Compact</NativeSelectOption>
              <NativeSelectOption value="comfortable">
                Comfortable
              </NativeSelectOption>
            </NativeSelect>
          </label>
          <p className="mt-2 border-t pt-3 text-xs font-medium text-muted-foreground">
            Display properties
          </p>
          {sectionColumns
            .filter(({ id }) => id !== "no" && id !== "name")
            .map(({ id, label }) => (
              <label
                key={id}
                className="flex items-center justify-between gap-2"
              >
                {label}
                <Switch
                  checked={!display.hidden.includes(id)}
                  onCheckedChange={(checked) =>
                    onDisplayChange({
                      ...display,
                      hidden: checked
                        ? display.hidden.filter((value) => value !== id)
                        : [...display.hidden, id],
                    })
                  }
                />
              </label>
            ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDisplayChange(defaultSectionDisplay)}
          >
            Reset display
          </Button>
        </PopoverContent>
      </Popover>
      {groupAction}
      {(filters.search || count > 0) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFiltersChange(emptySectionFilters)}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
