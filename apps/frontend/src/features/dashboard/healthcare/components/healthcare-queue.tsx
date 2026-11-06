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
import {
  healthcareDepartments,
  healthcareDoctors,
  healthcareQueue,
} from "@/mocks/dashboard-healthcare.mock";

import type { HealthcareAppointment } from "../types/healthcare";
import { queueStatusStyles } from "../utils/healthcare";
import { StatusBadge } from "./status-badge";

const doctorNames = new Map<string, string>(
  healthcareDoctors.map((doctor) => [doctor.id, doctor.name]),
);

const columns: ColumnDef<DataGridFeatures, HealthcareAppointment>[] = [
  {
    accessorKey: "patient",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Patient" />
    ),
    cell: ({ row }) => (
      <div className="flex min-w-40 flex-col">
        <span className="font-medium">{row.original.patient}</span>
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
    id: "doctor",
    accessorFn: (row) => doctorNames.get(row.doctorId) ?? row.doctorId,
    header: () => <DataGridHeader title="Doctor" />,
  },
  {
    accessorKey: "scheduled",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Scheduled" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.scheduled}</span>
    ),
  },
  {
    accessorKey: "waitedMinutes",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Waited" />
    ),
    cell: ({ row }) => {
      const minutes = row.original.waitedMinutes;
      const long = minutes >= 30;
      return (
        <span
          className={
            long ? "font-medium text-destructive tabular-nums" : "tabular-nums"
          }
        >
          {minutes ? `${minutes} min` : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <DataGridHeader title="Status" />,
    cell: ({ row }) => {
      const style = queueStatusStyles[row.original.status];
      return (
        <StatusBadge tone={style.tone} icon={style.icon}>
          {style.label}
        </StatusBadge>
      );
    },
  },
];

export function HealthcareQueue() {
  const waiting = healthcareQueue.filter(
    (appointment) => appointment.status === "waiting",
  ).length;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Appointment queue</CardTitle>
        <CardDescription>
          {waiting} patients waiting to be called
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <DataGridClient
          columns={columns}
          data={healthcareQueue}
          getRowId={(row) => row.id}
          defaultSorting={[{ id: "scheduled", desc: false }]}
          defaultPageSize={8}
          pagination="simple"
          toolbar={{
            searches: [{ key: "patient", placeholder: "Search patients..." }],
            facets: [
              {
                key: "department",
                title: "Department",
                options: healthcareDepartments.map((department) => ({
                  label: department.name,
                  value: department.name,
                })),
              },
              {
                key: "status",
                title: "Status",
                options: Object.entries(queueStatusStyles).map(
                  ([value, style]) => ({
                    label: style.label,
                    value,
                  }),
                ),
              },
            ],
          }}
          emptyFilteredTitle="No appointments match these filters"
          emptyFilteredDescription="Clear a filter to see the full queue."
        />
      </CardContent>
    </Card>
  );
}
