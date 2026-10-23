"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Download, Filter, RefreshCw, Settings2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridSearchInput } from "@/components/data-grid/data-grid-search-input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { createMockUsers, type User } from "@/mocks/user.mock";
import {
  emptyScrollFilters,
  filterScrollUsers,
  nextLoadedCount,
  SCROLL_BATCH_SIZE,
  SCROLL_USER_COUNT,
  type ScrollFilters,
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

function ScrollRows({
  users,
  compact,
  striped,
}: {
  users: User[];
  compact: boolean;
  striped: boolean;
}) {
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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground" role="status" aria-live="polite">
          {loaded.toLocaleString("en-US")} of{" "}
          {users.length.toLocaleString("en-US")} users loaded
          {loadingMore ? " · Loading more..." : ""}
        </p>
        <span className="text-xs text-muted-foreground">
          Scroll to load more
        </span>
      </div>
      <DataGridClient
        columns={columns}
        data={data}
        getRowId={(user) => user.id}
        pagination="none"
        showVisibilityToggle={false}
        showHeaderVisibilityToggle={false}
        emptyTitle="No users found"
        emptyDescription="Try another search or clear the filters."
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
        getCellProps={() => ({ className: compact ? "py-2" : "py-3.5" })}
        getRowProps={(user) => ({
          className:
            striped && Number(user.id.slice(4)) % 2 === 0
              ? "bg-muted/30"
              : undefined,
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
    </div>
  );
}

export function ScrollUserTable() {
  const [users] = useState(() => createMockUsers(SCROLL_USER_COUNT));
  const [filters, setFilters] = useState<ScrollFilters>(emptyScrollFilters);
  const [compact, setCompact] = useState(true);
  const [striped, setStriped] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const matching = useMemo(
    () => filterScrollUsers(users, filters),
    [users, filters],
  );
  const count = [filters.gender, filters.role, filters.status].filter(
    (value) => value !== "all",
  ).length;

  function exportUsers() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(matching, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.json";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 pb-4 sm:px-6">
        <div>
          <h2 className="font-semibold">User directory</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Jelajahi pengguna dengan scroll berkelanjutan.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportUsers}
          disabled={!matching.length}
        >
          <Download />
          Export
        </Button>
      </div>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-auto">
            <DataGridSearchInput
              value={filters.search}
              placeholder="Search ID, name, or email..."
              onChange={(search) => setFilters({ ...filters, search })}
            />
          </div>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" size="sm" />}>
              <Filter />
              Filters{count > 0 && <Badge variant="secondary">{count}</Badge>}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-4">
              <PopoverTitle>Filter users</PopoverTitle>
              {(
                [
                  {
                    key: "gender",
                    title: "Gender",
                    options: ["male", "female"],
                  },
                  {
                    key: "role",
                    title: "Role",
                    options: ["admin", "editor", "viewer"],
                  },
                  {
                    key: "status",
                    title: "Status",
                    options: ["active", "inactive", "pending"],
                  },
                ] as const
              ).map(({ key, title, options }) => (
                <label
                  key={key}
                  className="flex items-center justify-between gap-3"
                >
                  {title}
                  <NativeSelect
                    aria-label={`Filter ${key}`}
                    value={filters[key]}
                    onChange={(event) =>
                      setFilters({ ...filters, [key]: event.target.value })
                    }
                  >
                    <NativeSelectOption value="all">All</NativeSelectOption>
                    {options.map((value) => (
                      <NativeSelectOption key={value} value={value}>
                        {value}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </label>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters(emptyScrollFilters)}
              >
                Clear filters
              </Button>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefresh((current) => current + 1)}
          >
            <RefreshCw />
            Refresh
          </Button>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" size="sm" />}>
              <Settings2 />
              View settings
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-4">
              <PopoverTitle>View settings</PopoverTitle>
              <label className="flex items-center justify-between gap-3">
                Density
                <NativeSelect
                  aria-label="Density"
                  value={compact ? "compact" : "comfortable"}
                  onChange={(event) =>
                    setCompact(event.target.value === "compact")
                  }
                >
                  <NativeSelectOption value="compact">
                    Compact
                  </NativeSelectOption>
                  <NativeSelectOption value="comfortable">
                    Comfortable
                  </NativeSelectOption>
                </NativeSelect>
              </label>
              <label className="flex items-center justify-between gap-3">
                Row stripes
                <Switch checked={striped} onCheckedChange={setStriped} />
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCompact(true);
                  setStriped(false);
                }}
              >
                Reset view
              </Button>
            </PopoverContent>
          </Popover>
          {(filters.search || count > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters(emptyScrollFilters)}
            >
              Clear all
            </Button>
          )}
        </div>
        <ScrollRows
          key={`${JSON.stringify(filters)}:${refresh}`}
          users={matching}
          compact={compact}
          striped={striped}
        />
      </CardContent>
    </Card>
  );
}
