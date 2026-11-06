"use client";

import { useState } from "react";
import { WarehouseIcon } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { logisticsRoutes } from "@/mocks/dashboard-logistics.mock";

import type { LogisticsRoute, LogisticsStopStatus } from "../types/logistics";
import { pointAlongPath, polylinePoints } from "../utils/logistics";

const DEPOT = { x: 48, y: 120 };
const VIEW = { width: 600, height: 240 };

const stopLabel: Record<LogisticsStopStatus, string> = {
  done: "Delivered",
  pending: "Pending",
  failed: "Failed",
};

function routeStroke(route: LogisticsRoute) {
  return `var(--chart-${route.color})`;
}

export function LogisticsRouteBoard() {
  const [selected, setSelected] = useState<string | null>(null);
  const routes = logisticsRoutes;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Routes in progress</CardTitle>
        <CardDescription>
          {routes.length} routes out of the depot. Filled stops are delivered; a
          ring means pending.
        </CardDescription>
        <CardAction>
          <ToggleGroup
            value={selected ? [selected] : []}
            onValueChange={(value) => setSelected(value[0] ?? null)}
            variant="outline"
            size="sm"
            aria-label="Highlight route"
          >
            {routes.map((route) => (
              <ToggleGroupItem key={route.id} value={route.id}>
                {route.id}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <svg
          viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
          className="h-auto w-full rounded-lg bg-muted/40"
          role="img"
          aria-label="Schematic of today's delivery routes"
        >
          {routes.map((route) => {
            const path = [DEPOT, ...route.stops];
            const dimmed = selected !== null && selected !== route.id;
            const vehicle = pointAlongPath(path, route.progress);
            return (
              <g
                key={route.id}
                className={cn("transition-opacity", dimmed && "opacity-25")}
                aria-label={route.id}
              >
                <polyline
                  points={polylinePoints(path)}
                  fill="none"
                  stroke={routeStroke(route)}
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray="6 5"
                  opacity={0.45}
                />
                <circle
                  cx={vehicle.x}
                  cy={vehicle.y}
                  r={5.5}
                  fill={routeStroke(route)}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              </g>
            );
          })}
          {routes.map((route) => {
            const dimmed = selected !== null && selected !== route.id;
            return route.stops.map((stop) => (
              <Tooltip key={stop.id}>
                <TooltipTrigger
                  render={
                    <g
                      tabIndex={0}
                      aria-label={`${route.id} ${stop.label}: ${stopLabel[stop.status]}`}
                      className={cn(
                        "outline-none transition-opacity focus-visible:[&>circle:first-child]:stroke-ring",
                        dimmed && "opacity-25",
                      )}
                    >
                      <circle
                        cx={stop.x}
                        cy={stop.y}
                        r={9}
                        fill="transparent"
                        stroke="transparent"
                        strokeWidth={2}
                      />
                      <circle
                        cx={stop.x}
                        cy={stop.y}
                        r={4.5}
                        fill={
                          stop.status === "done"
                            ? routeStroke(route)
                            : stop.status === "failed"
                              ? "var(--destructive)"
                              : "var(--card)"
                        }
                        stroke={
                          stop.status === "failed"
                            ? "var(--destructive)"
                            : routeStroke(route)
                        }
                        strokeWidth={2}
                      />
                      {stop.status === "failed" && (
                        <path
                          d={`M${stop.x - 2.2},${stop.y - 2.2} L${stop.x + 2.2},${stop.y + 2.2} M${stop.x + 2.2},${stop.y - 2.2} L${stop.x - 2.2},${stop.y + 2.2}`}
                          stroke="var(--card)"
                          strokeWidth={1.5}
                        />
                      )}
                    </g>
                  }
                />
                <TooltipContent className="flex-col items-start gap-0.5">
                  <span className="font-medium">{stop.label}</span>
                  <span>
                    {route.id} · {stopLabel[stop.status]}
                  </span>
                </TooltipContent>
              </Tooltip>
            ));
          })}
          <g aria-label="Depot">
            <rect
              x={DEPOT.x - 14}
              y={DEPOT.y - 14}
              width={28}
              height={28}
              rx={6}
              className="fill-foreground"
            />
            <WarehouseIcon
              x={DEPOT.x - 8}
              y={DEPOT.y - 8}
              width={16}
              height={16}
              className="stroke-background"
              strokeWidth={2}
            />
            <text
              x={DEPOT.x}
              y={DEPOT.y + 28}
              textAnchor="middle"
              className="fill-muted-foreground text-[0.6875rem]"
            >
              Depot
            </text>
          </g>
        </svg>
        <ul className="grid gap-2 sm:grid-cols-2">
          {routes.map((route) => {
            const done = route.stops.filter(
              (stop) => stop.status === "done",
            ).length;
            const failed = route.stops.filter(
              (stop) => stop.status === "failed",
            ).length;
            const dimmed = selected !== null && selected !== route.id;
            return (
              <li
                key={route.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border border-border p-2.5 text-sm transition-opacity",
                  dimmed && "opacity-50",
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: routeStroke(route) }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {route.id} · {route.driver}
                  </p>
                  <p className="truncate text-xs text-muted-foreground tabular-nums">
                    {route.vehicle} · {done} of {route.stops.length} stops
                    {failed ? `, ${failed} failed` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  {route.nextEtaMinutes === null
                    ? "Stopped"
                    : `Next in ${route.nextEtaMinutes} min`}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
