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
  manufacturingMachines,
  manufacturingWorkOrders,
} from "@/mocks/dashboard-manufacturing.mock";

import type { ManufacturingWorkOrder } from "../types/manufacturing";
import {
  dueLabel,
  priorityLabels,
  workOrderStatusStyles,
} from "../utils/manufacturing";
import { StatusBadge } from "./status-badge";

const machineNames = new Map<string, string>(
  manufacturingMachines.map((machine) => [machine.id, machine.name]),
);

const types = ["Preventive", "Corrective", "Calibration"] as const;

function buildColumns(
  hour: number,
  minute: number,
): ColumnDef<DataGridFeatures, ManufacturingWorkOrder>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="Work order" />
      ),
      cell: ({ row }) => (
        <div className="flex min-w-52 flex-col">
          <span className="font-medium">{row.original.title}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {row.original.id}
          </span>
        </div>
      ),
    },
    {
      id: "machine",
      accessorFn: (row) => machineNames.get(row.machineId) ?? row.machineId,
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="Machine" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{machineNames.get(row.original.machineId)}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {row.original.machineId}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="Type" />
      ),
    },
    {
      id: "priority",
      accessorFn: (row) => String(row.priority),
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="Priority" />
      ),
      cell: ({ row }) => (
        <span
          className={
            row.original.priority === 1
              ? "font-medium text-destructive"
              : undefined
          }
        >
          {priorityLabels[row.original.priority]}
        </span>
      ),
    },
    {
      accessorKey: "dueMinutes",
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="Due" />
      ),
      cell: ({ row }) => {
        const overdue =
          row.original.dueMinutes < 0 && row.original.status !== "done";
        return (
          <span
            className={
              overdue
                ? "font-medium text-destructive tabular-nums"
                : "tabular-nums"
            }
          >
            {row.original.status === "done"
              ? "Closed"
              : dueLabel(row.original.dueMinutes, hour, minute)}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => <DataGridHeader title="Status" />,
      cell: ({ row }) => {
        const style = workOrderStatusStyles[row.original.status];
        return (
          <StatusBadge tone={style.tone} icon={style.icon}>
            {style.label}
          </StatusBadge>
        );
      },
    },
  ];
}

export function ManufacturingWorkOrders({
  hour,
  minute,
}: {
  hour: number;
  minute: number;
}) {
  const columns = buildColumns(hour, minute);
  const open = manufacturingWorkOrders.filter(
    (order) => order.status !== "done",
  ).length;
  const overdue = manufacturingWorkOrders.filter(
    (order) => order.status !== "done" && order.dueMinutes < 0,
  ).length;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Maintenance work orders</CardTitle>
        <CardDescription>
          {open} open{overdue ? `, ${overdue} overdue` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <DataGridClient
          columns={columns}
          data={manufacturingWorkOrders}
          getRowId={(row) => row.id}
          defaultSorting={[{ id: "dueMinutes", desc: false }]}
          defaultPageSize={8}
          pagination="simple"
          toolbar={{
            searches: [{ key: "title", placeholder: "Search work orders..." }],
            facets: [
              {
                key: "type",
                title: "Type",
                options: types.map((value) => ({ label: value, value })),
              },
              {
                key: "status",
                title: "Status",
                options: Object.entries(workOrderStatusStyles).map(
                  ([value, style]) => ({
                    label: style.label,
                    value,
                  }),
                ),
              },
              {
                key: "priority",
                title: "Priority",
                options: ([1, 2, 3] as const).map((value) => ({
                  label: priorityLabels[value],
                  value: String(value),
                })),
              },
            ],
          }}
          emptyFilteredTitle="No work orders match these filters"
          emptyFilteredDescription="Clear a filter to see every work order."
        />
      </CardContent>
    </Card>
  );
}
