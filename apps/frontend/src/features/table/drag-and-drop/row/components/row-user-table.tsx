"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridRowDragHandle } from "@/components/data-grid/data-grid-row-dnd";
import { reorderDataGridItems } from "@/components/data-grid/data-grid-reordering";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/mocks/user.mock";

const getRowId = (user: User) => user.id;
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const columns: ColumnDef<DataGridFeatures, User>[] = [
  {
    id: "drag",
    header: () => <span className="sr-only">Reorder</span>,
    enableHiding: false,
    cell: ({ row }) => (
      <DataGridRowDragHandle label={`Reorder ${row.original.name}`} />
    ),
  },
  {
    id: "no",
    header: () => <DataGridHeader title="No" />,
    cell: ({ row }) => <span className="tabular-nums">{row.index + 1}</span>,
  },
  {
    accessorKey: "id",
    header: () => <DataGridHeader title="User ID" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: () => <DataGridHeader title="Name" />,
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
  { accessorKey: "email", header: () => <DataGridHeader title="Email" /> },
  {
    accessorKey: "gender",
    header: () => <DataGridHeader title="Gender" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.gender}</span>
    ),
  },
  {
    accessorKey: "role",
    header: () => <DataGridHeader title="Role" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "joinDate",
    header: () => <DataGridHeader title="Join Date" />,
    cell: ({ row }) => (
      <time dateTime={row.original.joinDate}>
        {dateFormatter.format(new Date(row.original.joinDate))}
      </time>
    ),
  },
  {
    accessorKey: "status",
    header: () => <DataGridHeader title="Status" />,
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

export function RowUserTable({ users }: { users: User[] }) {
  const [orderedUsers, setOrderedUsers] = useState(users);

  return (
    <DataGridClient
      columns={columns}
      data={orderedUsers}
      getRowId={getRowId}
      onRowReorder={(activeId, overId) => {
        setOrderedUsers((current) =>
          reorderDataGridItems(current, activeId, overId, getRowId),
        );
      }}
      pagination="none"
      showVisibilityToggle={false}
      showHeaderVisibilityToggle={false}
    />
  );
}
