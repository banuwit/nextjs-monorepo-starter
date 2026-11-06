"use client";

import { useState } from "react";
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  ColumnVisibilityState,
} from "@tanstack/react-table";
import { StarIcon } from "lucide-react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridHeaderSort } from "@/components/data-grid/data-grid-header-sort";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  academyCourses,
  academyInstructors,
} from "@/mocks/dashboard-academy.mock";

import type { AcademyCourse } from "../types/academy";
import { courseStatusStyles, formatRating } from "../utils/academy";
import { integer } from "../utils/format";
import { StatusBadge } from "./status-badge";

const instructors = new Map<string, string>(
  academyInstructors.map((instructor) => [instructor.id, instructor.name]),
);

const categories = Array.from(
  new Set(academyCourses.map((course) => course.category)),
);

const columns: ColumnDef<DataGridFeatures, AcademyCourse>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Course" />
    ),
    cell: ({ row }) => (
      <div className="flex min-w-44 flex-col">
        <span className="font-medium">{row.original.title}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.category}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: () => <DataGridHeader title="Category" />,
    cell: ({ row }) => row.original.category,
  },
  {
    id: "instructor",
    accessorFn: (row) => instructors.get(row.instructorId) ?? "",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Instructor" />
    ),
    cell: ({ getValue }) => (
      <span className="whitespace-nowrap">{String(getValue())}</span>
    ),
  },
  {
    accessorKey: "learners",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Learners" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">
        {row.original.learners ? integer.format(row.original.learners) : "—"}
      </span>
    ),
  },
  {
    accessorKey: "completion",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Completion" />
    ),
    cell: ({ row }) => {
      const value = row.original.completion;
      if (row.original.status === "draft") {
        return <span className="text-muted-foreground">—</span>;
      }
      return (
        <div className="flex min-w-28 items-center gap-2">
          <div
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-label={`${row.original.title} completion`}
            className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                "h-full rounded-full",
                value >= 70 ? "bg-chart-1" : "bg-amber-500",
              )}
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="tabular-nums">{value}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Rating" />
    ),
    cell: ({ row }) =>
      row.original.rating ? (
        <span className="flex items-center gap-1 tabular-nums">
          <StarIcon
            className="size-3.5 fill-amber-500 text-amber-500"
            aria-hidden="true"
          />
          {formatRating(row.original.rating)}
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "status",
    header: () => <DataGridHeader title="Status" />,
    cell: ({ row }) => {
      const style = courseStatusStyles[row.original.status];
      return (
        <StatusBadge tone={style.tone} icon={style.icon}>
          {style.label}
        </StatusBadge>
      );
    },
  },
];

export function AcademyTopCourses() {
  // Category stays a hidden column so the facet can filter on it while the
  // Course cell shows it as a subtitle.
  const [visibility, setVisibility] = useState<ColumnVisibilityState>({
    category: false,
  });
  const [order, setOrder] = useState<ColumnOrderState>([]);
  const [pinning, setPinning] = useState<ColumnPinningState>({
    start: [],
    end: [],
  });
  const live = academyCourses.filter(
    (course) => course.status === "live",
  ).length;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Courses</CardTitle>
        <CardDescription>
          {live} live of {academyCourses.length} in the catalog
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <DataGridClient
          columns={columns}
          data={academyCourses}
          getRowId={(row) => row.id}
          defaultSorting={[{ id: "learners", desc: true }]}
          columnState={{
            visibility,
            order,
            pinning,
            onVisibilityChange: setVisibility,
            onOrderChange: setOrder,
            onPinningChange: setPinning,
          }}
          defaultPageSize={8}
          pagination="simple"
          toolbar={{
            searches: [{ key: "title", placeholder: "Search courses..." }],
            facets: [
              {
                key: "category",
                title: "Category",
                options: categories.map((category) => ({
                  label: category,
                  value: category,
                })),
              },
              {
                key: "status",
                title: "Status",
                options: Object.entries(courseStatusStyles).map(
                  ([value, style]) => ({ label: style.label, value }),
                ),
              },
            ],
          }}
          emptyFilteredTitle="No courses match these filters"
          emptyFilteredDescription="Clear a filter to see every course."
        />
      </CardContent>
    </Card>
  );
}
