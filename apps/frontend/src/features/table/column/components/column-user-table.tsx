"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridHeaderDropdown } from "@/components/data-grid/data-grid-header-dropdown";
import { DataGridServer } from "@/components/data-grid/data-grid-server";
import type { ToolbarConfig } from "@/components/data-grid/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User, UserListResult } from "@/mocks/user.mock";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const columns: ColumnDef<DataGridFeatures, User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataGridHeaderDropdown column={column} title="User ID" />
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
      <DataGridHeaderDropdown column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>
            {row.original.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataGridHeaderDropdown column={column} title="Email" />
    ),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataGridHeaderDropdown column={column} title="Gender" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">{row.original.gender}</span>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataGridHeaderDropdown column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "joinDate",
    header: ({ column }) => (
      <DataGridHeaderDropdown column={column} title="Join Date" />
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
      <DataGridHeaderDropdown column={column} title="Status" />
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

const toolbar: ToolbarConfig = {
  searches: [{ key: "search", placeholder: "Search ID, name, or email..." }],
  facets: [
    {
      key: "gender",
      title: "Gender",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ],
    },
    {
      key: "role",
      title: "Role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
    },
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
};

export function ColumnUserTable({ data, meta, filters }: UserListResult) {
  const numberedColumns = useMemo<ColumnDef<DataGridFeatures, User>[]>(
    () => [
      {
        id: "no",
        header: () => <DataGridHeader title="No" />,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <span className="tabular-nums">
            {(meta.page - 1) * meta.pageSize + row.index + 1}
          </span>
        ),
      },
      ...columns,
    ],
    [meta.page, meta.pageSize],
  );

  return (
    <DataGridServer
      columns={numberedColumns}
      data={data}
      meta={meta}
      filters={filters}
      getRowId={(user) => user.id}
      toolbar={toolbar}
      pagination="advance"
      enableColumnPinning
      enableColumnOrdering
      defaults={{ pageSize: 20, sortBy: "id", sortOrder: "asc" }}
      emptyFilteredTitle="No users found"
      emptyFilteredDescription="Try another search or clear the filters."
    />
  );
}
