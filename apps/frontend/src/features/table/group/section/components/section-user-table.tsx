"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, Ellipsis } from "lucide-react";
import { useState } from "react";
import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "../utils/user-sections";
import type { SectionFilters } from "../types/user-sections";
import { SectionTableControls } from "./section-table-controls";
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
  const [filters, setFilters] = useState<SectionFilters>(emptySectionFilters);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const sections = buildUserSections(users, filters);
  const toggleGroup = (role: string) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  const visibleUsers = sections.flatMap((section) => section.users);
  const widths: Record<string, number> = Object.fromEntries(
    sectionColumns.map(({ id, width }) => [id, width]),
  );
  widths.actions = 48;
  const totalWidth = Object.values(widths).reduce(
    (total, width) => total + width,
    0,
  );
  const columns: ColumnDef<DataGridFeatures, User>[] = [
    ...sectionColumns.map(
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
            <DropdownMenuItem onClick={() => setSelectedUser(row.original)}>
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
      <CardHeader>
        <CardTitle>User directory</CardTitle>
        <CardDescription>
          Profil pengguna dikelompokkan berdasarkan role.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <SectionTableControls filters={filters} onFiltersChange={setFilters} />
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
                </div>
              );
            },
          }}
        />
      </CardContent>
      {selectedUser && (
        <SectionUserDialog
          user={selectedUser}
          users={users}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </Card>
  );
}
