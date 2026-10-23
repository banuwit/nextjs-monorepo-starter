"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Ellipsis, Plus } from "lucide-react";
import { useState } from "react";
import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { User } from "@/mocks/user.mock";
import {
  buildUserSections,
  emptySectionFilters,
  sectionColumns,
  type SectionFilters,
} from "../user-sections";
import {
  defaultSectionDisplay,
  SectionTableControls,
  type SectionDisplay,
} from "./section-table-controls";
import { SectionUserDialog } from "./section-user-dialog";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function exportUser(user: User) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(user, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${user.id}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function SectionUserTable({ users }: { users: User[] }) {
  const [data, setData] = useState(users);
  const [filters, setFilters] = useState<SectionFilters>(emptySectionFilters);
  const [display, setDisplay] = useState<SectionDisplay>(defaultSectionDisplay);
  const [dialog, setDialog] = useState<{
    user?: User;
    role?: User["role"];
  } | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const sections = buildUserSections(data, filters);
  const visibleSections = sections.filter(
    (section) => section.users.length > 0,
  );
  const allCollapsed =
    visibleSections.length > 0 &&
    visibleSections.every((section) => collapsed.has(section.role));
  const toggleGroup = (role: string) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  const visibleUsers = sections.flatMap((section) => section.users);
  const visibleColumns = sectionColumns.filter(
    ({ id }) => !display.hidden.includes(id),
  );
  const widths: Record<string, number> = Object.fromEntries(
    visibleColumns.map(({ id, width }) => [id, width]),
  );
  widths.actions = 48;
  const totalWidth = Object.values(widths).reduce(
    (total, width) => total + width,
    0,
  );
  const columns: ColumnDef<DataGridFeatures, User>[] = [
    ...visibleColumns.map(
      ({ id, label }): ColumnDef<DataGridFeatures, User> => ({
        id,
        ...(id === "no" ? {} : { accessorKey: id }),
        header: () => <DataGridHeader title={label} />,
        enableSorting: false,
        cell: ({ row }) => {
          const user = row.original;
          if (id === "no")
            return (
              <span className="tabular-nums text-muted-foreground">
                {row.index + 1}
              </span>
            );
          if (id === "name")
            return (
              <div className="flex items-center gap-2">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="text-xs">
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate font-medium" title={user.name}>
                  {user.name}
                </span>
              </div>
            );
          if (id === "joinDate")
            return (
              <time dateTime={user.joinDate}>
                {dateFormatter.format(new Date(user.joinDate))}
              </time>
            );
          if (id === "status" || id === "role")
            return (
              <Badge
                variant={
                  id === "role"
                    ? "outline"
                    : user.status === "active"
                      ? "default"
                      : "secondary"
                }
                className="capitalize"
              >
                {user[id]}
              </Badge>
            );
          return (
            <span
              className={cn(
                "block truncate",
                id === "gender" && "capitalize",
                (id === "id" || id === "email") && "text-muted-foreground",
              )}
              title={user[id]}
            >
              {user[id]}
            </span>
          );
        },
      }),
    ),
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
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
            <DropdownMenuItem onClick={() => setDialog({ user: row.original })}>
              Open profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportUser(row.original)}>
              Export user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b px-4 pb-4 sm:px-6">
        <div>
          <h2 className="font-semibold">User directory</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Profil pengguna dikelompokkan berdasarkan role.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <div>
            <p className="text-xs text-muted-foreground">Users</p>
            <p className="font-semibold tabular-nums">{visibleUsers.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="font-semibold tabular-nums">
              {visibleUsers.filter((user) => user.status === "pending").length}
            </p>
          </div>
          <Button size="sm" onClick={() => setDialog({})}>
            <Plus />
            New user
          </Button>
        </div>
      </div>
      <CardContent className="space-y-5">
        <SectionTableControls
          filters={filters}
          onFiltersChange={setFilters}
          display={display}
          onDisplayChange={setDisplay}
          groupAction={
            <Button
              variant="outline"
              size="sm"
              disabled={visibleSections.length === 0}
              onClick={() =>
                setCollapsed(
                  allCollapsed
                    ? new Set()
                    : new Set(visibleSections.map((section) => section.role)),
                )
              }
            >
              {allCollapsed ? "Expand groups" : "Collapse groups"}
            </Button>
          }
        />
        <DataGridClient
          columns={columns}
          data={visibleUsers}
          getRowId={(user) => user.id}
          pagination="none"
          showVisibilityToggle={false}
          showHeaderVisibilityToggle={false}
          emptyTitle="No matching users"
          emptyDescription="Try another search or clear your filters."
          tableProps={{
            "aria-label": "Users grouped by role",
            className: "table-fixed",
            style: { minWidth: `${totalWidth / 16}rem` },
          }}
          getHeaderProps={(id) => ({
            style: { width: `${((widths[id] ?? 48) / totalWidth) * 100}%` },
          })}
          getCellProps={() => ({
            className: display.compact ? "py-2" : "py-4",
          })}
          rowGrouping={{
            getKey: (user) => user.role,
            isCollapsed: (key) => collapsed.has(key),
            renderHeader: ({ key, rows }) => {
              const section = sections.find((item) => item.role === key)!;
              return (
                <div
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5",
                    section.color,
                  )}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-inherit"
                    aria-label={`${collapsed.has(key) ? "Expand" : "Collapse"} ${section.label}`}
                    aria-expanded={!collapsed.has(key)}
                    onClick={() => toggleGroup(key)}
                  >
                    <ChevronRight
                      className={cn(
                        "size-4 transition-transform motion-reduce:transition-none",
                        !collapsed.has(key) && "rotate-90",
                      )}
                    />
                    <span className="font-semibold">{section.label}</span>
                    <Badge
                      variant="outline"
                      className="border-current/20 bg-background/50 text-inherit"
                    >
                      {rows.length}
                    </Badge>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto size-7 text-inherit"
                    aria-label={`Add user to ${section.label}`}
                    onClick={() => setDialog({ role: section.role })}
                  >
                    <Plus />
                  </Button>
                </div>
              );
            },
          }}
        />
        <p className="text-xs text-muted-foreground" role="status">
          {visibleUsers.length} of {data.length} users ·{" "}
          {sections.filter((section) => section.users.length > 0).length} role
          sections · Perubahan hanya disimpan lokal.
        </p>
      </CardContent>
      {dialog && (
        <SectionUserDialog
          {...dialog}
          users={data}
          onClose={() => setDialog(null)}
          onCreate={(user) => {
            setData((current) => [...current, user]);
            setFilters(emptySectionFilters);
            setCollapsed((current) => {
              const next = new Set(current);
              next.delete(user.role);
              return next;
            });
          }}
        />
      )}
    </Card>
  );
}
