"use client";

import { DataGridSearchInput } from "@/components/data-grid/data-grid-search-input";
import { Button } from "@/components/ui/button";
import { FacetedFilter } from "@/components/filters/faceted-filter";
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

export function TreeTableControls({
  filters,
  onFiltersChange,
}: {
  filters: TreeFilters;
  onFiltersChange: (filters: TreeFilters) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DataGridSearchInput
        placeholder="Search ID, name, or email..."
        value={filters.search}
        onChange={(search) => onFiltersChange({ ...filters, search })}
      />
      <FacetedFilter
        title="Gender"
        options={[
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ]}
        value={filters.gender}
        onValueChange={(gender) =>
          onFiltersChange({
            ...filters,
            gender: gender as TreeFilters["gender"],
          })
        }
      />
      <FacetedFilter
        title="Role"
        options={[
          { label: "Admin", value: "admin" },
          { label: "Editor", value: "editor" },
          { label: "Viewer", value: "viewer" },
        ]}
        value={filters.role}
        onValueChange={(role) =>
          onFiltersChange({ ...filters, role: role as TreeFilters["role"] })
        }
      />
      <FacetedFilter
        title="Status"
        options={[
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
          { label: "Pending", value: "pending" },
        ]}
        value={filters.status}
        onValueChange={(status) =>
          onFiltersChange({
            ...filters,
            status: status as TreeFilters["status"],
          })
        }
      />
      {Boolean(
        filters.search ||
        filters.gender.length ||
        filters.role.length ||
        filters.status.length,
      ) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFiltersChange(emptyTreeFilters)}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
