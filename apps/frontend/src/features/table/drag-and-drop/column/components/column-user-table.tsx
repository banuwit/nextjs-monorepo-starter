"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeaderDrag } from "@/components/data-grid/data-grid-header-dnd";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    id: "no",
    header: () => <DataGridHeaderDrag title="No" />,
    cell: ({ row }) => <span className="tabular-nums">{row.index + 1}</span>,
  },
  {
    accessorKey: "id",
    header: () => <DataGridHeaderDrag title="User ID" />,
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {row.original.id}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: () => <DataGridHeaderDrag title="Name" />,
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
  { accessorKey: "email", header: () => <DataGridHeaderDrag title="Email" /> },
  {
    accessorKey: "gender",
    header: () => <DataGridHeaderDrag title="Gender" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.gender}</span>
    ),
  },
  {
    accessorKey: "role",
    header: () => <DataGridHeaderDrag title="Role" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "joinDate",
    header: () => <DataGridHeaderDrag title="Join Date" />,
    cell: ({ row }) => (
      <time dateTime={row.original.joinDate}>
        {dateFormatter.format(new Date(row.original.joinDate))}
      </time>
    ),
  },
  {
    accessorKey: "status",
    header: () => <DataGridHeaderDrag title="Status" />,
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

const initialOrder = ["no", "id", "name", "email", "gender", "role", "joinDate", "status"];

export function ColumnUserTable({ users }: { users: User[] }) {
  const [order, setOrder] = useState(initialOrder);
  const reordered = order.some((id, index) => id !== initialOrder[index]);

  return (
    <DataGridClient
      columns={columns}
      data={users}
      getRowId={getRowId}
      columnDrag={{ order, onOrderChange: setOrder }}
      pagination="none"
      showVisibilityToggle={false}
      showHeaderVisibilityToggle={false}
      actions={
        <Button
          variant="outline"
          size="sm"
          disabled={!reordered}
          onClick={() => setOrder(initialOrder)}
        >
          <RotateCcw data-icon="inline-start" />
          Reset columns
        </Button>
      }
    />
  );
}
