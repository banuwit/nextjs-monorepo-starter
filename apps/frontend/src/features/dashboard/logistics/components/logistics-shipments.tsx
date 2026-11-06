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
  logisticsRoutes,
  logisticsShipments,
} from "@/mocks/dashboard-logistics.mock";

import type { LogisticsShipment } from "../types/logistics";
import { etaLabel, shipmentStatusStyles } from "../utils/logistics";
import { StatusBadge } from "./status-badge";

const drivers = new Map<string, string>(
  logisticsRoutes.map((route) => [route.id, route.driver]),
);

function buildColumns(
  hour: number,
  minute: number,
): ColumnDef<DataGridFeatures, LogisticsShipment>[] {
  return [
    {
      accessorKey: "customer",
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="Shipment" />
      ),
      cell: ({ row }) => (
        <div className="flex min-w-44 flex-col">
          <span className="font-medium">{row.original.customer}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {row.original.id} · {row.original.area}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "routeId",
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="Route" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="tabular-nums">{row.original.routeId}</span>
          <span className="text-xs text-muted-foreground">
            {drivers.get(row.original.routeId)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <DataGridHeader title="Status" />,
      cell: ({ row }) => {
        const style = shipmentStatusStyles[row.original.status];
        return (
          <StatusBadge tone={style.tone} icon={style.icon}>
            {style.label}
          </StatusBadge>
        );
      },
    },
    {
      id: "eta",
      accessorFn: (row) => row.etaMinutes ?? Number.MAX_SAFE_INTEGER,
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="ETA" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">
          {etaLabel(row.original, hour, minute)}
        </span>
      ),
    },
    {
      accessorKey: "stopsLeft",
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="Stops left" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.stopsLeft || "—"}</span>
      ),
    },
    {
      accessorKey: "weightKg",
      header: ({ column }) => (
        <DataGridHeaderSort column={column} title="Weight" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">
          {row.original.weightKg.toFixed(1)} kg
        </span>
      ),
    },
  ];
}

export function LogisticsShipments({
  hour,
  minute,
}: {
  hour: number;
  minute: number;
}) {
  const columns = buildColumns(hour, minute);
  const open = logisticsShipments.filter(
    (shipment) =>
      shipment.status !== "delivered" && shipment.status !== "failed",
  ).length;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Active shipments</CardTitle>
        <CardDescription>{open} still on the road</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <DataGridClient
          columns={columns}
          data={logisticsShipments}
          getRowId={(row) => row.id}
          defaultSorting={[{ id: "eta", desc: false }]}
          defaultPageSize={8}
          pagination="simple"
          toolbar={{
            searches: [{ key: "customer", placeholder: "Search customers..." }],
            facets: [
              {
                key: "routeId",
                title: "Route",
                options: logisticsRoutes.map((route) => ({
                  label: route.id,
                  value: route.id,
                })),
              },
              {
                key: "status",
                title: "Status",
                options: Object.entries(shipmentStatusStyles).map(
                  ([value, style]) => ({
                    label: style.label,
                    value,
                  }),
                ),
              },
            ],
          }}
          emptyFilteredTitle="No shipments match these filters"
          emptyFilteredDescription="Clear a filter to see every shipment."
        />
      </CardContent>
    </Card>
  );
}
