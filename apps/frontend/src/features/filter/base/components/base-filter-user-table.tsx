"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridHeaderSort } from "@/components/data-grid/data-grid-header-sort";
import { DataGridServer } from "@/components/data-grid/data-grid-server";
import type { ToolbarConfig } from "@/components/data-grid/types";
import type { SelectOption } from "@/components/filter/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cities, departments } from "@/mocks/user.mock";
import type { User, UserListResult } from "@/mocks/user.mock";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

export function BaseFilterUserTable({
  data,
  meta,
  filters,
  managerOptions,
  joinMonthOptions,
}: UserListResult & {
  managerOptions: SelectOption[];
  joinMonthOptions: SelectOption[];
}) {
  const columns = useMemo<ColumnDef<DataGridFeatures, User>[]>(() => {
    const managerNames = new Map(
      managerOptions.map((option) => [option.value, option.label]),
    );

    return [
      {
        id: "no",
        header: () => <DataGridHeader title="No" />,
        enableSorting: false,
        cell: ({ row }) => (
          <span className="tabular-nums">
            {(meta.page - 1) * meta.pageSize + row.index + 1}
          </span>
        ),
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataGridHeaderSort column={column} title="User ID" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataGridHeaderSort column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="font-medium">{row.original.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataGridHeaderSort column={column} title="Role" />
        ),
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.role}
          </Badge>
        ),
      },
      {
        accessorKey: "department",
        header: () => <DataGridHeader title="Department" />,
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap">{row.original.department}</span>
        ),
      },
      {
        accessorKey: "city",
        header: () => <DataGridHeader title="City" />,
        enableSorting: false,
      },
      {
        id: "manager",
        header: () => <DataGridHeader title="Manager" />,
        enableSorting: false,
        cell: ({ row }) =>
          row.original.managerId ? (
            managerNames.get(row.original.managerId)
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "joinDate",
        header: ({ column }) => (
          <DataGridHeaderSort column={column} title="Join Date" />
        ),
        cell: ({ row }) => (
          <time dateTime={row.original.joinDate}>
            {dateFormatter.format(new Date(row.original.joinDate))}
          </time>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataGridHeaderSort column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === "active"
                ? "default"
                : row.original.status === "pending"
                  ? "outline"
                  : "secondary"
            }
            className="capitalize"
          >
            {row.original.status}
          </Badge>
        ),
      },
    ];
  }, [managerOptions, meta.page, meta.pageSize]);

  const toolbar = useMemo<ToolbarConfig>(
    () => ({
      searches: [
        { key: "search", placeholder: "Search ID, name, or email..." },
      ],
      dropdowns: [
        {
          key: "role",
          placeholder: "Role",
          allLabel: "All roles",
          options: [
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
            { label: "Viewer", value: "viewer" },
          ],
        },
        {
          key: "joinMonth",
          placeholder: "Join month",
          allLabel: "Any month",
          options: joinMonthOptions,
        },
      ],
      comboboxes: [
        {
          key: "manager",
          placeholder: "Search manager...",
          emptyMessage: "No manager found.",
          options: managerOptions,
        },
        {
          key: "department",
          placeholder: "Department...",
          emptyMessage: "No department found.",
          multiple: true,
          options: departments.map((name) => ({ label: name, value: name })),
        },
        {
          key: "city",
          placeholder: "City",
          searchPlaceholder: "Search city...",
          emptyMessage: "No city found.",
          trigger: "popup",
          options: cities.map((name) => ({ label: name, value: name })),
        },
      ],
      facets: [
        {
          key: "status",
          title: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Pending", value: "pending" },
          ],
        },
      ],
    }),
    [managerOptions, joinMonthOptions],
  );

  return (
    <DataGridServer
      columns={columns}
      data={data}
      meta={meta}
      filters={filters}
      getRowId={(user) => user.id}
      toolbar={toolbar}
      pagination="simple"
      showVisibilityToggle={false}
      showHeaderVisibilityToggle={false}
      defaults={{ pageSize: 20, sortBy: "id", sortOrder: "asc" }}
      emptyFilteredTitle="No users found"
      emptyFilteredDescription="Try another search or clear the filters."
    />
  );
}
