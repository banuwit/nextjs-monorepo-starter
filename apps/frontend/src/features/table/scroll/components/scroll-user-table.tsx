"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridSearchInput } from "@/components/data-grid/data-grid-search-input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createMockUsers, type User } from "@/mocks/user.mock";
import {
  filterScrollUsers,
  nextLoadedCount,
  SCROLL_BATCH_SIZE,
  SCROLL_USER_COUNT,
} from "../user-scroll";

const fields = [
  { id: "name", title: "Name", width: 230 },
  { id: "id", title: "User ID", width: 110 },
  { id: "email", title: "Email", width: 280 },
  { id: "gender", title: "Gender", width: 90 },
  { id: "role", title: "Role", width: 95 },
  { id: "joinDate", title: "Join date", width: 120 },
  { id: "status", title: "Status", width: 100 },
] as const;
const totalWidth = fields.reduce((total, field) => total + field.width, 0);
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const columns: ColumnDef<DataGridFeatures, User>[] = fields.map(
  ({ id, title }) => ({
    accessorKey: id,
    header: () => <DataGridHeader title={title} />,
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original;
      if (id === "name")
        return (
          <div className="flex items-center gap-2">
            <Avatar className="size-7 shrink-0">
              <AvatarFallback className="text-xs">
                {user.name
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="truncate font-medium" title={user.name}>
              {user.name}
            </span>
          </div>
        );
      if (id === "status" || id === "role")
        return (
          <Badge
            variant={
              id === "role"
                ? "outline"
                : user.status === "active"
                  ? "default"
                  : user.status === "pending"
                    ? "outline"
                    : "secondary"
            }
            className="capitalize"
          >
            {user[id]}
          </Badge>
        );
      if (id === "joinDate")
        return (
          <time dateTime={user.joinDate}>
            {dateFormatter.format(new Date(user.joinDate))}
          </time>
        );
      return (
        <span
          className={
            id === "gender"
              ? "capitalize"
              : "block truncate text-muted-foreground"
          }
          title={user[id]}
        >
          {user[id]}
        </span>
      );
    },
  }),
);

function ScrollRows({ users }: { users: User[] }) {
  const [loaded, setLoaded] = useState(() =>
    Math.min(SCROLL_BATCH_SIZE, users.length),
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadMore = useCallback(() => {
    if (timer.current !== null || loaded >= users.length) return;
    setLoadingMore(true);
    timer.current = setTimeout(() => {
      setLoaded((current) => nextLoadedCount(current, users.length));
      setLoadingMore(false);
      timer.current = null;
    }, 450);
  }, [loaded, users.length]);
  useEffect(
    () => () => {
      if (timer.current !== null) clearTimeout(timer.current);
    },
    [],
  );
  const data = useMemo(() => users.slice(0, loaded), [users, loaded]);

  return (
    <DataGridClient
      columns={columns}
      data={data}
      getRowId={(user) => user.id}
      pagination="none"
      showVisibilityToggle={false}
      showHeaderVisibilityToggle={false}
      stickyHeader={true}
      compact={true}
      striped={false}
      columnLines={true}
      emptyTitle="No users found"
      emptyDescription="Try another search."
      tableProps={{
        "aria-label": "User directory",
        className: "table-fixed",
        style: { minWidth: `${totalWidth / 16}rem` },
      }}
      getHeaderProps={(id) => ({
        style: {
          width: `${((fields.find((field) => field.id === id)?.width ?? 100) / totalWidth) * 100}%`,
        },
      })}
      virtualScroll={{
        label: "Scrollable user directory",
        height: "min(35rem, 65vh)",
        totalCount: users.length,
        hasMore: loaded < users.length,
        loadingMore,
        onLoadMore: loadMore,
      }}
    />
  );
}

export function ScrollUserTable() {
  const [users] = useState(() => createMockUsers(SCROLL_USER_COUNT));
  const [search, setSearch] = useState("");
  const matching = useMemo(
    () => filterScrollUsers(users, search),
    [users, search],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>User directory</CardTitle>
        <CardDescription>
          Jelajahi pengguna dengan scroll berkelanjutan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DataGridSearchInput
          value={search}
          placeholder="Search ID, name, or email..."
          onChange={setSearch}
        />
        <ScrollRows key={search} users={matching} />
      </CardContent>
    </Card>
  );
}
