"use client";

import { useState, type KeyboardEvent } from "react";
import { ThermometerIcon, WavesIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  manufacturingFloorLanes,
  manufacturingFloorPlan,
  manufacturingFloorSize,
} from "@/mocks/dashboard-manufacturing.mock";

import type {
  ManufacturingMachine,
  ManufacturingMachineStatus,
} from "../types/manufacturing";
import { boxFaces, floorTile, iso, polygon } from "../utils/isometric";
import { isOverThreshold, machineStatusStyles } from "../utils/manufacturing";
import { Sparkline } from "./sparkline";
import { StatusBadge } from "./status-badge";

const VIEW = { width: 640, height: 372 };
const ORIGIN = { x: 268, y: 44 };

/** Full Tailwind classes per status so the build keeps them. */
const faceClass: Record<
  ManufacturingMachineStatus,
  { top: string; side: string; dot: string }
> = {
  running: { top: "fill-chart-1", side: "fill-chart-1", dot: "bg-chart-1" },
  idle: {
    top: "fill-muted-foreground",
    side: "fill-muted-foreground",
    dot: "bg-muted-foreground",
  },
  down: {
    top: "fill-destructive",
    side: "fill-destructive",
    dot: "bg-destructive",
  },
  maintenance: {
    top: "fill-amber-500",
    side: "fill-amber-500",
    dot: "bg-amber-500",
  },
};

const statusOrder: ManufacturingMachineStatus[] = [
  "running",
  "idle",
  "down",
  "maintenance",
];

function Reading({
  icon: Icon,
  label,
  values,
  unit,
  limit,
  over,
  decimals,
}: {
  icon: typeof ThermometerIcon;
  label: string;
  values: readonly number[];
  unit: string;
  limit: number;
  over: boolean;
  decimals: number;
}) {
  const latest = values.at(-1) ?? 0;
  return (
    <div className="flex items-center gap-3">
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-muted-foreground">
          {label} · limit {limit}
          {unit}
        </span>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            over && "text-destructive",
          )}
        >
          {latest.toFixed(decimals)}
          {unit}
          {over && <span className="sr-only"> (above limit)</span>}
        </span>
      </div>
      <Sparkline values={values} className="shrink-0" />
    </div>
  );
}

function FloorMachine({
  machine,
  slot,
  selected,
  fresh,
  onSelect,
}: {
  machine: ManufacturingMachine;
  slot: { x: number; y: number; w: number; d: number; h: number };
  selected: boolean;
  fresh: boolean;
  onSelect: () => void;
}) {
  const faces = boxFaces(slot.x, slot.y, slot.w, slot.d, slot.h, ORIGIN);
  const classes = faceClass[machine.status];
  const over = isOverThreshold(machine);
  const style = machineStatusStyles[machine.status];
  // Two LEDs on the top face near the front corner: temperature, vibration.
  const ledA = iso(
    slot.x + slot.w - 0.45,
    slot.y + slot.d - 0.35,
    slot.h,
    ORIGIN,
  );
  const ledB = iso(
    slot.x + slot.w - 0.85,
    slot.y + slot.d - 0.35,
    slot.h,
    ORIGIN,
  );
  const shadow = floorTile(
    slot.x + 0.15,
    slot.y + 0.15,
    slot.w,
    slot.d,
    ORIGIN,
  );

  function onKeyDown(event: KeyboardEvent<SVGGElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${machine.name} (${machine.id}), ${style.label}${over.temp || over.vibration ? ", sensor above limit" : ""}`}
      className="cursor-pointer outline-none"
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <polygon points={polygon(shadow)} className="fill-foreground/10" />
      <polygon
        points={polygon(faces.left)}
        className={classes.side}
        fillOpacity={0.55}
      />
      <polygon
        points={polygon(faces.right)}
        className={classes.side}
        fillOpacity={0.75}
      />
      <polygon
        points={polygon(faces.top)}
        className={cn(
          classes.top,
          "stroke-card transition-[stroke] [stroke-width:1.5]",
          selected && "stroke-ring [stroke-width:3]",
        )}
        fillOpacity={0.95}
      />
      {/* Focus ring drawn around the top face. */}
      <polygon
        points={polygon(faces.top)}
        fill="none"
        className="stroke-transparent [stroke-width:3] [g:focus-visible>&]:stroke-ring"
      />
      <text
        x={faces.center.x}
        y={faces.center.y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        className="pointer-events-none fill-primary-foreground text-[0.6875rem] font-semibold tabular-nums"
      >
        {machine.id}
      </text>
      <circle
        cx={ledA.x}
        cy={ledA.y}
        r={2.4}
        className={over.temp ? "fill-red-300" : "fill-emerald-200"}
      />
      <circle
        cx={ledB.x}
        cy={ledB.y}
        r={2.4}
        className={over.vibration ? "fill-red-300" : "fill-emerald-200"}
      />
      {fresh && (
        <circle
          cx={faces.center.x}
          cy={faces.center.y - 14}
          r={4}
          className="fill-emerald-500 motion-safe:animate-ping"
        />
      )}
    </g>
  );
}

export function ManufacturingMachineBoard({
  machines,
  latestId,
}: {
  machines: ManufacturingMachine[];
  latestId: string | null;
}) {
  const [selectedId, setSelectedId] = useState(machines[0]?.id ?? "");
  const selected =
    machines.find((machine) => machine.id === selectedId) ?? machines[0];
  const running = machines.filter(
    (machine) => machine.status === "running",
  ).length;
  const down = machines.filter((machine) => machine.status === "down").length;
  const counts = statusOrder.map((status) => ({
    status,
    count: machines.filter((machine) => machine.status === status).length,
  }));

  // Farther boxes first so nearer ones overlap them correctly.
  const slots = [...manufacturingFloorPlan].sort(
    (a, b) => a.x + a.y - (b.x + b.y),
  );
  const { cols, rows } = manufacturingFloorSize;
  const floor = floorTile(0, 0, cols, rows, ORIGIN);

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Production floor</CardTitle>
        <CardDescription>
          {running} of {machines.length} running{down ? `, ${down} down` : ""}.
          Pick a machine on the floor to inspect it. Sensors update every 5
          seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="flex min-w-0 flex-col gap-3">
          <svg
            viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
            className="h-auto w-full rounded-lg bg-muted/40"
            role="group"
            aria-label="Isometric floor plan of the production hall"
          >
            <polygon
              points={polygon(floor)}
              className="fill-card stroke-border"
              strokeWidth={1}
            />
            {manufacturingFloorLanes.map((lane, index) => {
              const tile = floorTile(0, lane.y, cols, lane.d, ORIGIN);
              const belt = floorTile(
                0.5,
                lane.y + lane.d - 0.3,
                cols - 1,
                0.18,
                ORIGIN,
              );
              const labelAt = iso(-0.2, lane.y + lane.d / 2, 0, ORIGIN);
              return (
                <g key={lane.lineId} aria-label={lane.label}>
                  <polygon
                    points={polygon(tile)}
                    className={index % 2 ? "fill-muted/40" : "fill-transparent"}
                  />
                  <polygon
                    points={polygon(belt)}
                    className="fill-foreground/15"
                  />
                  <text
                    x={labelAt.x - 6}
                    y={labelAt.y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="fill-muted-foreground text-[0.625rem] font-medium"
                  >
                    {lane.lineId}
                  </text>
                </g>
              );
            })}
            {slots.map((slot) => {
              const machine = machines.find(
                (candidate) => candidate.id === slot.machineId,
              );
              if (!machine) return null;
              return (
                <FloorMachine
                  key={machine.id}
                  machine={machine}
                  slot={slot}
                  selected={machine.id === selected?.id}
                  fresh={machine.id === latestId}
                  onSelect={() => setSelectedId(machine.id)}
                />
              );
            })}
          </svg>
          <dl className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {counts.map(({ status, count }) => (
              <div key={status} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={cn("size-2.5 rounded-sm", faceClass[status].dot)}
                />
                <dt className="text-muted-foreground">
                  {machineStatusStyles[status].label}
                </dt>
                <dd className="font-medium tabular-nums">{count}</dd>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full bg-emerald-200 ring-1 ring-emerald-500/40"
              />
              <dt className="text-muted-foreground">LEDs: temp, vibration</dt>
              <dd className="font-medium">red above limit</dd>
            </div>
          </dl>
        </div>

        {selected && (
          <aside
            aria-live="polite"
            className="flex flex-col gap-4 rounded-lg border border-border p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{selected.name}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {selected.id} · {selected.lineId} · {selected.uptimePct}%
                  uptime
                </p>
              </div>
              <StatusBadge
                tone={machineStatusStyles[selected.status].tone}
                icon={machineStatusStyles[selected.status].icon}
                className="shrink-0"
              >
                {machineStatusStyles[selected.status].label}
              </StatusBadge>
            </div>
            <Reading
              icon={ThermometerIcon}
              label="Temp"
              values={selected.temp}
              unit="°C"
              limit={selected.maxTemp}
              over={isOverThreshold(selected).temp}
              decimals={0}
            />
            <Reading
              icon={WavesIcon}
              label="Vibration"
              values={selected.vibration}
              unit=" mm/s"
              limit={selected.maxVibration}
              over={isOverThreshold(selected).vibration}
              decimals={1}
            />
            <ul className="mt-auto flex flex-col gap-1 border-t border-border pt-3">
              {machines.map((machine) => (
                <li key={machine.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(machine.id)}
                    aria-pressed={machine.id === selected.id}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs hover:bg-muted aria-pressed:bg-muted",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-2 shrink-0 rounded-sm",
                        faceClass[machine.status].dot,
                      )}
                    />
                    <span className="truncate">{machine.name}</span>
                    <span className="ml-auto tabular-nums text-muted-foreground">
                      {machine.id}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </CardContent>
    </Card>
  );
}
