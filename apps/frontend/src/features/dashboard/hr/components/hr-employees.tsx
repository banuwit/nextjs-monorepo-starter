"use client";

import type { ColumnDef } from "@tanstack/react-table";

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
import { hrDepartments, hrEmployees } from "@/mocks/dashboard-hr.mock";

import type { HrEmployee } from "../types/hr";
import { employeeStatusStyles, formatTenure } from "../utils/hr";
import { StatusBadge } from "./status-badge";

const columns: ColumnDef<DataGridFeatures, HrEmployee>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Employee" />
    ),
    cell: ({ row }) => (
      <div className="flex min-w-44 flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {row.original.id}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Department" />
    ),
  },
  {
    accessorKey: "role",
    header: () => <DataGridHeader title="Role" />,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Location" />
    ),
  },
  {
    accessorKey: "tenureYears",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Tenure" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatTenure(row.original.tenureYears)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <DataGridHeader title="Status" />,
    cell: ({ row }) => {
      const style = employeeStatusStyles[row.original.status];
      return (
        <StatusBadge tone={style.tone} icon={style.icon}>
          {style.label}
        </StatusBadge>
      );
    },
  },
];

const locations = [...new Set(hrEmployees.map((employee) => employee.location))]
  .sort()
  .map((location) => ({ label: location, value: location }));

export function HrEmployees() {
  const attention = hrEmployees.filter(
    (employee) =>
      employee.status === "probation" || employee.status === "notice",
  ).length;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Employee directory</CardTitle>
        <CardDescription>
          {attention} on probation or serving notice
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <DataGridClient
          columns={columns}
          data={hrEmployees}
          getRowId={(row) => row.id}
          defaultSorting={[{ id: "tenureYears", desc: true }]}
          defaultPageSize={8}
          pagination="simple"
          toolbar={{
            searches: [{ key: "name", placeholder: "Search employees..." }],
            facets: [
              {
                key: "department",
                title: "Department",
                options: hrDepartments.map((department) => ({
                  label: department.name,
                  value: department.name,
                })),
              },
              {
                key: "status",
                title: "Status",
                options: Object.entries(employeeStatusStyles).map(
                  ([value, style]) => ({
                    label: style.label,
                    value,
                  }),
                ),
              },
              { key: "location", title: "Location", options: locations },
            ],
          }}
          emptyFilteredTitle="No employees match these filters"
          emptyFilteredDescription="Clear a filter to see everyone."
        />
      </CardContent>
    </Card>
  );
}
