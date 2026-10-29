"use client";

import type { ColumnDef, HeaderContext } from "@tanstack/react-table";
import { useMemo } from "react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridHeaderSort } from "@/components/data-grid/data-grid-header-sort";
import {
  findTone,
  initials,
  ToneBadge,
} from "@/components/filter/advanced/value-displays";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/mocks/user-profile.mock";
import { formatRupiah, regionOf, REGIONS } from "../utils/user-profile-filter";
import { LEVEL_TONES, STATUS_TONES } from "../utils/user-tones";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const formatDay = (day: string) =>
  dateFormatter.format(new Date(`${day}T00:00:00Z`));

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const REGION_LABELS = new Map<string, string>(
  REGIONS.map((region) => [region.value, region.label]),
);

/**
 * The user table shared by the filter demos: `users` names managers, `rows`
 * is what the page's query left standing. Every column is shown (the table
 * scrolls sideways), so a filter on any attribute can be checked in the rows.
 */
export function UserProfileGrid({
  users,
  rows,
}: {
  users: UserProfile[];
  rows: UserProfile[];
}) {
  const columns = useMemo<ColumnDef<DataGridFeatures, UserProfile>[]>(() => {
    const names = new Map(users.map((user) => [user.id, user.name]));
    const sortHeader =
      (title: string) =>
      ({ column }: HeaderContext<DataGridFeatures, UserProfile, unknown>) => (
        <DataGridHeaderSort column={column} title={title} />
      );
    const label = (title: string) => () => <DataGridHeader title={title} />;

    return [
      {
        accessorKey: "id",
        header: sortHeader("User ID"),
        enableHiding: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: sortHeader("Name"),
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="font-medium whitespace-nowrap">
                {row.original.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "level",
        header: sortHeader("Level"),
        cell: ({ row }) => (
          <ToneBadge
            tone={findTone(LEVEL_TONES, row.original.level)}
            label={capitalize(row.original.level)}
          />
        ),
      },
      {
        accessorKey: "status",
        header: sortHeader("Status"),
        cell: ({ row }) => (
          <ToneBadge
            tone={findTone(STATUS_TONES, row.original.status)}
            label={capitalize(row.original.status)}
          />
        ),
      },
      {
        accessorKey: "department",
        header: sortHeader("Department"),
        cell: ({ row }) => (
          <span className="whitespace-nowrap">{row.original.department}</span>
        ),
      },
      { accessorKey: "city", header: sortHeader("City") },
      {
        id: "region",
        accessorFn: (user) => regionOf(user.city) ?? "",
        header: label("Region"),
        cell: ({ getValue }) => REGION_LABELS.get(String(getValue())) ?? "—",
      },
      {
        accessorKey: "role",
        header: sortHeader("Role"),
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.role}
          </Badge>
        ),
      },
      {
        id: "manager",
        header: label("Manager"),
        enableSorting: false,
        cell: ({ row }) =>
          row.original.managerId ? (
            <span className="whitespace-nowrap">
              {names.get(row.original.managerId)}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "score",
        header: sortHeader("Score"),
        cell: ({ row }) => (
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="relative h-1.5 w-12 overflow-hidden rounded-full bg-muted"
            >
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${row.original.score}%` }}
              />
            </span>
            <span className="tabular-nums">{row.original.score}</span>
          </span>
        ),
      },
      {
        accessorKey: "salary",
        header: sortHeader("Salary"),
        cell: ({ row }) => (
          <span className="whitespace-nowrap tabular-nums">
            {formatRupiah(row.original.salary)}
          </span>
        ),
      },
      {
        accessorKey: "experienceYears",
        header: sortHeader("Experience"),
        cell: ({ row }) => `${row.original.experienceYears} th`,
      },
      {
        accessorKey: "employmentType",
        header: sortHeader("Employment"),
        cell: ({ row }) => capitalize(row.original.employmentType),
      },
      {
        accessorKey: "joinDate",
        header: sortHeader("Joined"),
        cell: ({ row }) => (
          <time dateTime={row.original.joinDate} className="whitespace-nowrap">
            {formatDay(row.original.joinDate)}
          </time>
        ),
      },
      {
        accessorKey: "lastActiveAt",
        header: sortHeader("Last active"),
        cell: ({ row }) => (
          <time
            dateTime={row.original.lastActiveAt}
            className="whitespace-nowrap"
          >
            {formatDay(row.original.lastActiveAt)}
          </time>
        ),
      },
      {
        id: "skills",
        header: label("Skills"),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="flex gap-1">
            {row.original.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </span>
        ),
      },
      {
        id: "devices",
        header: label("Devices"),
        enableSorting: false,
        cell: ({ row }) => row.original.devices.join(", "),
      },
      {
        id: "permissions",
        header: label("Permissions"),
        enableSorting: false,
        cell: ({ row }) => row.original.permissions.join(", "),
      },
      {
        id: "twoFactor",
        header: label("2FA"),
        enableSorting: false,
        cell: ({ row }) => (row.original.twoFactor ? "On" : "Off"),
      },
      {
        id: "employeeCode",
        header: label("Code"),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-mono tracking-wider">
            {row.original.employeeCode}
          </span>
        ),
      },
    ];
  }, [users]);

  return (
    <DataGridClient
      columns={columns}
      data={rows}
      getRowId={(user) => user.id}
      pagination="simple"
      defaultSorting={[{ id: "id", desc: false }]}
      showVisibilityToggle={false}
      showHeaderVisibilityToggle={false}
      emptyTitle="No users found"
      emptyDescription="Ubah kondisi atau hapus filter."
    />
  );
}
