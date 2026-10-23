"use client";

import type { ReactTable } from "@tanstack/react-table";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridSearchInput } from "@/components/data-grid/data-grid-search-input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/mocks/user.mock";

export const userColumnLabels = {
  id: "User ID",
  name: "Name",
  email: "Email",
  gender: "Gender",
  role: "Role",
  joinDate: "Join Date",
  status: "Status",
};

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

export function ExpansionTableControls({
  table,
}: {
  table: ReactTable<DataGridFeatures, User>;
}) {
  const filter = (key: string, value: string) => {
    table
      .getColumn(key)
      ?.setFilterValue(value === "all" || value === "" ? undefined : value);
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DataGridSearchInput
        placeholder="Search users..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(value) => filter("name", value)}
      />
      <Choice
        label="Filter role"
        value={(table.getColumn("role")?.getFilterValue() as string) ?? "all"}
        onChange={(value) => filter("role", value)}
        options={[
          { value: "all", label: "All roles" },
          ...["admin", "editor", "viewer"].map((value) => ({
            value,
            label: value[0]!.toUpperCase() + value.slice(1),
          })),
        ]}
      />
      <Choice
        label="Filter status"
        value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
        onChange={(value) => filter("status", value)}
        options={[
          { value: "all", label: "All statuses" },
          ...["active", "inactive", "pending"].map((value) => ({
            value,
            label: value[0]!.toUpperCase() + value.slice(1),
          })),
        ]}
      />
      {table.store.state.columnFilters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetColumnFilters()}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
