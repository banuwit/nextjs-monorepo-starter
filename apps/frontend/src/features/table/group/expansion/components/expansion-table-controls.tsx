"use client";

import type { ReactTable } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridSearchInput } from "@/components/data-grid/data-grid-search-input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
  compact,
  onCompactChange,
  showReports,
  onShowReportsChange,
}: {
  table: ReactTable<DataGridFeatures, User>;
  compact: boolean;
  onCompactChange: (value: boolean) => void;
  showReports: boolean;
  onShowReportsChange: (value: boolean) => void;
}) {
  const sorting = table.store.state.sorting[0];
  const filter = (key: string, value: string) => {
    table
      .getColumn(key)
      ?.setFilterValue(value === "all" || value === "" ? undefined : value);
    table.setPageIndex(0);
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
          onClick={() => {
            table.resetColumnFilters();
            table.setPageIndex(0);
          }}
        >
          Clear filters
        </Button>
      )}
      <Popover>
        <PopoverTrigger
          render={<Button variant="outline" size="sm" className="ml-auto" />}
        >
          <Settings2 />
          View Settings
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="max-h-[75vh] w-72 overflow-y-auto p-4"
        >
          <PopoverTitle>View Settings</PopoverTitle>
          <div className="flex items-center justify-between gap-2">
            <span>Ordering</span>
            <Choice
              label="Ordering"
              value={sorting?.id ?? "id"}
              options={Object.entries(userColumnLabels).map(
                ([value, label]) => ({ value, label }),
              )}
              onChange={(id) => {
                table.setSorting([{ id, desc: sorting?.desc ?? false }]);
                table.setPageIndex(0);
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>Direction</span>
            <div className="flex gap-1">
              {[false, true].map((desc) => (
                <Button
                  key={String(desc)}
                  variant={
                    (sorting?.desc ?? false) === desc ? "secondary" : "ghost"
                  }
                  size="sm"
                  aria-pressed={(sorting?.desc ?? false) === desc}
                  onClick={() => {
                    table.setSorting([{ id: sorting?.id ?? "id", desc }]);
                    table.setPageIndex(0);
                  }}
                >
                  {desc ? "Desc" : "Asc"}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span>Density</span>
            <Choice
              label="Density"
              value={compact ? "compact" : "comfortable"}
              options={[
                { value: "compact", label: "Compact" },
                { value: "comfortable", label: "Comfortable" },
              ]}
              onChange={(value) => onCompactChange(value === "compact")}
            />
          </div>
          <label className="flex items-center justify-between border-y py-3">
            Report cards
            <Switch
              checked={showReports}
              onCheckedChange={onShowReportsChange}
            />
          </label>
          <p className="text-xs font-medium text-muted-foreground">Columns</p>
          {Object.entries(userColumnLabels)
            .filter(([id]) => id !== "id" && id !== "name")
            .map(([id, label]) => (
              <label key={id} className="flex items-center justify-between">
                {label}
                <Switch
                  checked={table.getColumn(id)?.getIsVisible() ?? true}
                  onCheckedChange={(checked) =>
                    table.getColumn(id)?.toggleVisibility(checked)
                  }
                />
              </label>
            ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              table.resetColumnVisibility();
              table.setSorting([{ id: "id", desc: false }]);
              table.setPageIndex(0);
              onCompactChange(true);
              onShowReportsChange(true);
            }}
          >
            Reset view
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
