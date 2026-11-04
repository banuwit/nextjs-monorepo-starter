"use client";

import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridHeaderSort } from "@/components/data-grid/data-grid-header-sort";
import type { ToolbarConfig } from "@/components/data-grid/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { FleetState, Van } from "../types/map-delivery";
import {
  bodyLabels,
  exceptionLabels,
  exceptionTone,
  parcelsOnBoard,
  powertrainLabels,
  routeNeedKm,
  statusLabels,
  statusTone,
  stopsForVan,
  worstException,
} from "../utils/map-delivery";

/** One flat row per van so toolbar filters can target plain column ids. */
type VanRow = {
  id: string;
  van: Van;
  search: string;
  driver: string;
  area: string;
  status: Van["status"];
  body: Van["body"];
  powertrain: Van["powertrain"];
  charge: "low" | "medium" | "high";
  alert: string;
  atRisk: "yes" | "no";
  load: number;
  rangeKm: number;
};

export type VanGridAction = "view" | "sheet" | "edit" | "retire";

type VanGridProps = {
  state: FleetState;
  onAdd: () => void;
  onAction: (action: VanGridAction, van: Van) => void;
};

export function VanGrid({ state, onAdd, onAction }: VanGridProps) {
  const rows = useMemo<VanRow[]>(
    () =>
      state.vans.map((van) => {
        const driver = state.drivers.find((item) => item.id === van.driverId)?.name ?? "";
        const area = state.areas.find((item) => item.id === van.areaId)?.name ?? "";
        const exception = worstException(state.exceptions, van.id);
        const atRisk = stopsForVan(state.stops, van.id).some(
          (stop) => stop.status === "to-go" && stop.eta > stop.window.end,
        );
        return {
          id: van.id,
          van,
          search: `${van.name} ${van.plate} ${driver} ${area}`,
          driver,
          area,
          status: van.status,
          body: van.body,
          powertrain: van.powertrain,
          charge: van.energyPct < 25 ? "low" : van.energyPct < 60 ? "medium" : "high",
          alert: exception?.kind ?? "none",
          atRisk: atRisk ? "yes" : "no",
          load: parcelsOnBoard(van, state.stops),
          rangeKm: van.rangeKm,
        };
      }),
    [state],
  );

  const columns = useMemo<ColumnDef<DataGridFeatures, VanRow>[]>(
    () => [
      {
        accessorKey: "search",
        header: ({ column }) => <DataGridHeaderSort column={column} title="Van" />,
        cell: ({ row }) => (
          <button
            type="button"
            className="text-left font-medium hover:underline"
            onClick={() => onAction("view", row.original.van)}
          >
            {row.original.van.name}
            <span className="block text-xs font-normal text-muted-foreground">{row.original.van.plate}</span>
          </button>
        ),
      },
      {
        accessorKey: "driver",
        header: ({ column }) => <DataGridHeaderSort column={column} title="Driver" />,
      },
      {
        accessorKey: "area",
        header: ({ column }) => <DataGridHeaderSort column={column} title="Area" />,
      },
      {
        accessorKey: "status",
        header: () => <DataGridHeader title="Status" />,
        cell: ({ row }) => (
          <Badge className={cn("border-transparent", statusTone[row.original.status])}>
            {statusLabels[row.original.status]}
          </Badge>
        ),
      },
      {
        accessorKey: "body",
        header: () => <DataGridHeader title="Vehicle" />,
        cell: ({ row }) => bodyLabels[row.original.body],
      },
      {
        accessorKey: "powertrain",
        header: () => <DataGridHeader title="Powertrain" />,
        cell: ({ row }) => powertrainLabels[row.original.powertrain],
      },
      {
        accessorKey: "charge",
        header: ({ column }) => <DataGridHeaderSort column={column} title="Charge" />,
        cell: ({ row }) => (
          <span className={cn("tabular-nums", row.original.charge === "low" && "font-medium text-amber-600 dark:text-amber-300")}>
            {row.original.van.energyPct.toFixed(0)}%
          </span>
        ),
      },
      {
        accessorKey: "load",
        header: ({ column }) => <DataGridHeaderSort column={column} title="Load" />,
        cell: ({ row }) => (
          <span className="tabular-nums">
            {row.original.load}/{row.original.van.capacity}
          </span>
        ),
      },
      {
        accessorKey: "rangeKm",
        header: ({ column }) => <DataGridHeaderSort column={column} title="Range" />,
        cell: ({ row }) => {
          const need = routeNeedKm(row.original.van, state.stops, state.depot);
          const short = need > row.original.rangeKm;
          return (
            <span className={cn("tabular-nums", short && "font-medium text-amber-600 dark:text-amber-300")}>
              {Math.round(row.original.rangeKm)} km
              <span className="block text-xs font-normal text-muted-foreground">needs {Math.round(need)} km</span>
            </span>
          );
        },
      },
      {
        accessorKey: "alert",
        header: () => <DataGridHeader title="Alert" />,
        cell: ({ row }) => {
          const kind = row.original.alert;
          if (kind === "none") return <span className="text-muted-foreground">—</span>;
          const tone = exceptionTone[kind as keyof typeof exceptionTone];
          return (
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs", tone.badge)}>
              <span className={cn("size-1.5 rounded-full", tone.dot)} aria-hidden />
              {exceptionLabels[kind as keyof typeof exceptionLabels]}
            </span>
          );
        },
      },
      {
        accessorKey: "atRisk",
        header: () => <DataGridHeader title="At risk" />,
        cell: ({ row }) =>
          row.original.atRisk === "yes" ? (
            <Badge className="border-transparent bg-orange-500/15 text-orange-700 dark:text-orange-300">At risk</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-xs" aria-label={`Actions for ${row.original.van.name}`} />}
            >
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction("view", row.original.van)}>Show on map</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("sheet", row.original.van)}>Vehicle sheet</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction("edit", row.original.van)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={row.original.van.status === "retired"}
                onClick={() => onAction("retire", row.original.van)}
              >
                Retire
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
      },
    ],
    [onAction, state.stops, state.depot],
  );

  const toolbar = useMemo<ToolbarConfig>(
    () => ({
      searches: [{ key: "search", placeholder: "Search van, plate, driver, or area…" }],
      facets: [
        {
          key: "status",
          title: "Status",
          options: (Object.keys(statusLabels) as Van["status"][]).map((value) => ({ label: statusLabels[value], value })),
        },
        {
          key: "alert",
          title: "Alerts",
          options: [
            ...(Object.keys(exceptionLabels) as (keyof typeof exceptionLabels)[]).map((value) => ({ label: exceptionLabels[value], value })),
            { label: "None", value: "none" },
          ],
        },
        { key: "atRisk", title: "At risk", variant: "single", options: [{ label: "At risk", value: "yes" }, { label: "On plan", value: "no" }] },
      ],
      dropdowns: [
        {
          key: "body",
          placeholder: "Vehicle",
          allLabel: "All vehicles",
          options: (Object.keys(bodyLabels) as Van["body"][]).map((value) => ({ label: bodyLabels[value], value })),
        },
        {
          key: "powertrain",
          placeholder: "Powertrain",
          allLabel: "All powertrains",
          options: (Object.keys(powertrainLabels) as Van["powertrain"][]).map((value) => ({ label: powertrainLabels[value], value })),
        },
        {
          key: "charge",
          placeholder: "Charge",
          allLabel: "Any charge",
          options: [
            { label: "Low (< 25%)", value: "low" },
            { label: "Medium (25–60%)", value: "medium" },
            { label: "High (> 60%)", value: "high" },
          ],
        },
      ],
      comboboxes: [
        {
          key: "driver",
          placeholder: "Driver",
          trigger: "popup",
          searchPlaceholder: "Search driver…",
          options: state.drivers.map((driver) => ({ label: driver.name, value: driver.name })),
        },
      ],
    }),
    [state.drivers],
  );

  return (
    <DataGridClient
      columns={columns}
      data={rows}
      getRowId={(row) => row.id}
      toolbar={toolbar}
      pagination="simple"
      defaultPageSize={10}
      defaultColumnPinning={{ start: [], end: ["actions"] }}
      actions={
        <Button size="sm" onClick={onAdd}>
          <PlusIcon /> Add van
        </Button>
      }
      emptyTitle="No vans"
      emptyDescription="Add a van to start dispatching."
      emptyFilteredTitle="No vans match"
      emptyFilteredDescription="Try clearing a filter."
    />
  );
}
