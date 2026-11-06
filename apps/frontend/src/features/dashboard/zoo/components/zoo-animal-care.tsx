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
import { zooAnimals } from "@/mocks/dashboard-zoo.mock";

import type { ZooAnimal } from "../types/zoo";
import { animalStatusStyles } from "../utils/zoo";
import { StatusBadge } from "./status-badge";
import { TrendDelta } from "./trend-delta";

const zones = Array.from(new Set(zooAnimals.map((animal) => animal.zone)));

const columns: ColumnDef<DataGridFeatures, ZooAnimal>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Animal" />
    ),
    cell: ({ row }) => (
      <div className="flex min-w-40 flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.species}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "zone",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Enclosure" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span>{row.original.enclosure}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.zone}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "keeper",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Keeper" />
    ),
  },
  {
    accessorKey: "lastCheck",
    header: ({ column }) => (
      <DataGridHeaderSort column={column} title="Last check" />
    ),
    cell: ({ row }) => (
      <time className="tabular-nums">{row.original.lastCheck}</time>
    ),
  },
  {
    id: "weight",
    header: () => <DataGridHeader title="Weight trend" />,
    cell: ({ row }) => <TrendDelta delta={row.original.weight} />,
  },
  {
    accessorKey: "status",
    header: () => <DataGridHeader title="Status" />,
    cell: ({ row }) => {
      const style = animalStatusStyles[row.original.status];
      return (
        <StatusBadge tone={style.tone} icon={style.icon}>
          {style.label}
        </StatusBadge>
      );
    },
  },
];

export function ZooAnimalCare() {
  const flagged = zooAnimals.filter(
    (animal) => animal.status !== "healthy",
  ).length;

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Animal care</CardTitle>
        <CardDescription>
          {flagged} of {zooAnimals.length} animals need follow-up
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <DataGridClient
          columns={columns}
          data={zooAnimals}
          getRowId={(row) => row.id}
          defaultSorting={[{ id: "lastCheck", desc: false }]}
          defaultPageSize={8}
          pagination="simple"
          toolbar={{
            searches: [{ key: "name", placeholder: "Search animals..." }],
            facets: [
              {
                key: "zone",
                title: "Zone",
                options: zones.map((zone) => ({ label: zone, value: zone })),
              },
              {
                key: "status",
                title: "Status",
                options: Object.entries(animalStatusStyles).map(
                  ([value, style]) => ({ label: style.label, value }),
                ),
              },
            ],
          }}
          emptyFilteredTitle="No animals match these filters"
          emptyFilteredDescription="Clear a filter to see every animal."
        />
      </CardContent>
    </Card>
  );
}
