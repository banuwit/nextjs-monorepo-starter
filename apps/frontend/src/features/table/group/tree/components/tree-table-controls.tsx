"use client";

import { Filter, Settings2 } from "lucide-react";
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
import { emptyTreeFilters, type TreeFilters } from "../user-tree";

export const treeColumns = [
  { id: "name", label: "Name", width: 360 },
  { id: "id", label: "User ID", width: 100 },
  { id: "email", label: "Email", width: 230 },
  { id: "gender", label: "Gender", width: 90 },
  { id: "role", label: "Role", width: 90 },
  { id: "reports", label: "Reports", width: 90 },
  { id: "joinDate", label: "Join date", width: 120 },
  { id: "status", label: "Status", width: 95 },
] as const;
export type TreeColumnId = (typeof treeColumns)[number]["id"];
export type TreeDisplay = { compact: boolean; hidden: TreeColumnId[] };
export const defaultTreeDisplay: TreeDisplay = { compact: true, hidden: [] };

export function TreeTableControls({
  filters,
  onFiltersChange,
  display,
  onDisplayChange,
  depth,
  onDepthChange,
}: {
  filters: TreeFilters;
  onFiltersChange: (filters: TreeFilters) => void;
  display: TreeDisplay;
  onDisplayChange: (display: TreeDisplay) => void;
  depth: number | null;
  onDepthChange: (depth: number) => void;
}) {
  const count =
    Number(filters.role !== "all") + Number(filters.status !== "all");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DataGridSearchInput
        placeholder="Search users..."
        value={filters.search}
        onChange={(search) => onFiltersChange({ ...filters, search })}
      />
      <div
        className="mr-auto flex items-center gap-1"
        role="group"
        aria-label="Tree depth"
      >
        <span className="mr-1 text-xs text-muted-foreground">Depth</span>
        {[0, 1, 2, Infinity].map((value) => (
          <Button
            key={value}
            size="sm"
            variant={depth === value ? "secondary" : "ghost"}
            aria-pressed={depth === value}
            aria-label={
              value === 0
                ? "Collapse to roots"
                : value === Infinity
                  ? "Expand all levels"
                  : `Expand to level ${value}`
            }
            onClick={() => onDepthChange(value)}
          >
            {value === 0 ? "Collapse" : value === Infinity ? "All" : value}
          </Button>
        ))}
      </div>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          <Filter />
          Filter{count > 0 && <Badge variant="secondary">{count}</Badge>}
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-4">
          <PopoverTitle>Filter users</PopoverTitle>
          <label className="flex items-center justify-between gap-2">
            Role
            <NativeSelect
              aria-label="Filter role"
              value={filters.role}
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  role: event.target.value as TreeFilters["role"],
                })
              }
            >
              <NativeSelectOption value="all">All roles</NativeSelectOption>
              {(["admin", "editor", "viewer"] as const).map((role) => (
                <NativeSelectOption key={role} value={role}>
                  {role}
                </NativeSelectOption>
              ))}
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
                  status: event.target.value as TreeFilters["status"],
                })
              }
            >
              <NativeSelectOption value="all">All statuses</NativeSelectOption>
              {(["active", "inactive", "pending"] as const).map((status) => (
                <NativeSelectOption key={status} value={status}>
                  {status}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </label>
          <p className="text-xs text-muted-foreground">
            Atasan tetap ditampilkan sebagai konteks hierarki.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFiltersChange(emptyTreeFilters)}
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
          {treeColumns
            .filter(({ id }) => id !== "name")
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
            onClick={() => onDisplayChange(defaultTreeDisplay)}
          >
            Reset display
          </Button>
        </PopoverContent>
      </Popover>
      {(filters.search || count > 0) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFiltersChange(emptyTreeFilters)}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
