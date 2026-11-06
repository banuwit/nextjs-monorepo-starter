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
import { hospitalityReservations } from "@/mocks/dashboard-hospitality.mock";

import type {
  HospitalityChannel,
  HospitalityReservation,
  HospitalityRoomType,
} from "../types/hospitality";
import { formatShortDay, reservationStatusStyles } from "../utils/hospitality";
import { StatusBadge } from "./status-badge";

const channels: readonly HospitalityChannel[] = [
  "Direct",
  "OTA",
  "Corporate",
  "Walk-in",
];

const roomTypes: readonly HospitalityRoomType[] = [
  "Standard",
  "Deluxe",
  "Suite",
];

const columns: ColumnDef<DataGridFeatures, HospitalityReservation>[] = [
  {
    accessorKey: "guest",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Reservation" />
    ),
    cell: ({ row }) => (
      <div className="flex min-w-44 flex-col">
        <span className="font-medium">{row.original.guest}</span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {row.original.id}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "roomType",
    header: () => <DataGridHeader title="Room" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="tabular-nums">{row.original.room}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.roomType}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "checkIn",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Check-in" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatShortDay(row.original.checkIn)}
      </span>
    ),
  },
  {
    accessorKey: "checkOut",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Check-out" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatShortDay(row.original.checkOut)}
      </span>
    ),
  },
  {
    accessorKey: "nights",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Nights" />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.nights}</span>
    ),
  },
  {
    accessorKey: "channel",
    header: () => <DataGridHeader title="Channel" />,
    cell: ({ row }) => row.original.channel,
  },
  {
    accessorKey: "status",
    header: () => <DataGridHeader title="Status" />,
    cell: ({ row }) => {
      const style = reservationStatusStyles[row.original.status];
      return (
        <StatusBadge tone={style.tone} icon={style.icon}>
          {style.label}
        </StatusBadge>
      );
    },
  },
];

export function HospitalityReservations({ today }: { today: string }) {
  const reservations = hospitalityReservations(today);
  const arrivingToday = reservations.filter(
    (reservation) =>
      reservation.status === "confirmed" &&
      reservation.checkIn === today.slice(0, 10),
  ).length;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Reservations</CardTitle>
        <CardDescription>
          {reservations.length} bookings this week, {arrivingToday} confirmed
          for tonight
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <DataGridClient
          columns={columns}
          data={reservations}
          getRowId={(row) => row.id}
          defaultSorting={[{ id: "checkIn", desc: false }]}
          defaultPageSize={8}
          pagination="simple"
          toolbar={{
            searches: [{ key: "guest", placeholder: "Search guests..." }],
            facets: [
              {
                key: "channel",
                title: "Channel",
                options: channels.map((channel) => ({
                  label: channel,
                  value: channel,
                })),
              },
              {
                key: "status",
                title: "Status",
                options: Object.entries(reservationStatusStyles).map(
                  ([value, style]) => ({ label: style.label, value }),
                ),
              },
              {
                key: "roomType",
                title: "Room type",
                options: roomTypes.map((type) => ({
                  label: type,
                  value: type,
                })),
              },
            ],
          }}
          emptyFilteredTitle="No reservations match these filters"
          emptyFilteredDescription="Clear a filter to see every booking."
        />
      </CardContent>
    </Card>
  );
}
