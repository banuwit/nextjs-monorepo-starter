"use client";

import { DataGridSearchInput } from "@/components/data-grid/data-grid-search-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { emptySectionFilters } from "../utils/user-sections";
import type { SectionFilters } from "../types/user-sections";

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next !== null) onChange(next);
      }}
    >
      <SelectTrigger aria-label={label}>
        <SelectValue>
          {options.find((option) => option.value === value)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SectionTableControls({
  filters,
  onFiltersChange,
}: {
  filters: SectionFilters;
  onFiltersChange: (filters: SectionFilters) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DataGridSearchInput
        placeholder="Search users..."
        value={filters.search}
        onChange={(search) => onFiltersChange({ ...filters, search })}
      />
      <Choice
        label="Filter gender"
        value={filters.gender}
        onChange={(gender) =>
          onFiltersChange({
            ...filters,
            gender: gender as SectionFilters["gender"],
          })
        }
        options={[
          { value: "all", label: "All genders" },
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]}
      />
      <Choice
        label="Filter status"
        value={filters.status}
        onChange={(status) =>
          onFiltersChange({
            ...filters,
            status: status as SectionFilters["status"],
          })
        }
        options={[
          { value: "all", label: "All statuses" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "pending", label: "Pending" },
        ]}
      />
      {(filters.search ||
        filters.gender !== "all" ||
        filters.status !== "all") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFiltersChange(emptySectionFilters)}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
