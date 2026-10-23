"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Ellipsis } from "lucide-react";
import { useId, useState } from "react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { User } from "@/mocks/user.mock";
import {
  ExpansionTableControls,
  userColumnLabels,
} from "./expansion-table-controls";
import { UserReportCards } from "./user-report-cards";
import { getDirectReports } from "../user-reporting";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function ExpansionUserTable({ users }: { users: User[] }) {
  const gridId = useId();
  const [data, setData] = useState(users);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const detailsId = (user: User) => `${gridId}-reports-${user.id}`;
  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const changeStatus = (user: User, status: User["status"]) => {
    setData((current) =>
      current.map((item) => (item.id === user.id ? { ...item, status } : item)),
    );
  };
  const columns: ColumnDef<DataGridFeatures, User>[] = [
    {
      id: "expand",
      header: () => <span className="sr-only">Expand</span>,
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        const reports = getDirectReports(data, user.id);
        return reports.length > 0 ? (
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            aria-label={`${expanded.has(user.id) ? "Collapse" : "Expand"} reports of ${user.name}`}
            aria-expanded={expanded.has(user.id)}
            aria-controls={expanded.has(user.id) ? detailsId(user) : undefined}
            onClick={() => toggle(user.id)}
          >
            <ChevronRight
              className={cn(
                "size-4 transition-transform motion-reduce:transition-none",
                expanded.has(user.id) && "rotate-90",
              )}
            />
          </Button>
        ) : (
          <span className="size-6" aria-hidden="true" />
        );
      },
    },
    {
      id: "no",
      header: () => <DataGridHeader title="No" />,
      enableHiding: false,
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {row.index + 1}
        </span>
      ),
    },
    ...Object.entries(userColumnLabels).map(
      ([key, title]): ColumnDef<DataGridFeatures, User> => ({
        id: key,
        accessorKey: key as keyof User,
        header: () => <DataGridHeader title={title} />,
        enableHiding: key !== "id" && key !== "name",
        filterFn:
          key === "name"
            ? (row, _columnId, value: string) =>
                [row.original.id, row.original.name, row.original.email].some(
                  (text) =>
                    text.toLowerCase().includes(value.trim().toLowerCase()),
                )
            : (row, columnId, value: string) =>
                row.getValue(columnId) === value,
        cell: ({ row }) => {
          const user = row.original;
          if (key === "id")
            return <span className="text-muted-foreground">{user.id}</span>;
          if (key === "name")
            return (
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarFallback className="text-xs">
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.name}</span>
              </div>
            );
          if (key === "joinDate")
            return (
              <time dateTime={user.joinDate}>
                {dateFormatter.format(new Date(user.joinDate))}
              </time>
            );
          if (key === "status" || key === "role")
            return (
              <Badge
                className="capitalize"
                variant={
                  key === "role"
                    ? "outline"
                    : user.status === "active"
                      ? "default"
                      : "secondary"
                }
              >
                {user[key]}
              </Badge>
            );
          return (
            <span className={key === "gender" ? "capitalize" : undefined}>
              {user[key as keyof User]}
            </span>
          );
        },
      }),
    ),
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label={`Actions for ${row.original.id}`}
              />
            }
          >
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={getDirectReports(data, row.original.id).length === 0}
              onClick={() =>
                setExpanded((current) => new Set([...current, row.original.id]))
              }
            >
              View direct reports
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={row.original.status === "active"}
              onClick={() => changeStatus(row.original, "active")}
            >
              Activate user
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={row.original.status === "pending"}
              onClick={() => changeStatus(row.original, "pending")}
            >
              Mark pending
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={row.original.status === "inactive"}
              onClick={() => changeStatus(row.original, "inactive")}
            >
              Deactivate user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="@container">
      <DataGridClient
        data={data}
        columns={columns}
        getRowId={(user) => user.id}
        defaultSorting={[{ id: "id", desc: false }]}
        pagination="none"
        showVisibilityToggle={false}
        showHeaderVisibilityToggle={false}
        compact={true}
        tableProps={{
          "aria-label": "User profiles with expandable direct reports",
          className: "min-w-[65rem]",
        }}
        getHeaderProps={(columnId) => ({
          className: columnId === "expand" ? "w-10" : undefined,
        })}
        getCellProps={({ columnId }) => ({
          className: columnId === "expand" ? "w-10" : undefined,
        })}
        renderToolbar={(table) => <ExpansionTableControls table={table} />}
        renderRowDetails={(user) => {
          const reports = getDirectReports(data, user.id);
          return expanded.has(user.id) && reports.length > 0 ? (
            <UserReportCards
              manager={user}
              reports={reports}
              id={detailsId(user)}
            />
          ) : null;
        }}
      />
    </div>
  );
}
