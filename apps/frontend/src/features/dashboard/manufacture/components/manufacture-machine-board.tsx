"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { ThermometerIcon, WavesIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type {
  ManufactureMachine,
  ManufactureMachineStatus,
} from "../types/manufacture";
import { boxFaces, floorTile, iso, polygon } from "../utils/isometric";
import { isOverThreshold, machineStatusStyles } from "../utils/manufacture";
import {
  WAREHOUSE,
  floorLanes,
  machineSprites,
  sceneProps,
  sortKey,
  type PartTone,
  type ScenePart,
} from "../utils/warehouse-scene";
import { Sparkline } from "./sparkline";
import { StatusBadge } from "./status-badge";

const VIEW = { width: 680, height: 440 };
const ORIGIN = { x: 262, y: 128 };
const UNIT_PX = 24;

type Point = { x: number; y: number };

/** Face classes per tone; full class names so Tailwind keeps them. */
const toneClass: Record<
  PartTone,
  { top: string; left: string; right: string }
> = {
  metal: {
    top: "fill-slate-300 dark:fill-slate-400",
    left: "fill-slate-400 dark:fill-slate-500",
    right: "fill-slate-500 dark:fill-slate-600",
  },
  metalDark: {
    top: "fill-slate-500",
    left: "fill-slate-600",
    right: "fill-slate-700",
  },
  accent: {
    top: "fill-chart-1",
    left: "fill-chart-1/80",
    right: "fill-chart-1/60",
  },
  belt: {
    top: "fill-neutral-700 dark:fill-neutral-600",
    left: "fill-neutral-800",
    right: "fill-neutral-900",
  },
  roller: {
    top: "fill-neutral-400",
    left: "fill-neutral-500",
    right: "fill-neutral-600",
  },
  pallet: {
    top: "fill-amber-200 dark:fill-amber-300",
    left: "fill-amber-300 dark:fill-amber-400",
    right: "fill-amber-400 dark:fill-amber-500",
  },
  crate: {
    top: "fill-orange-200 dark:fill-orange-300",
    left: "fill-orange-300 dark:fill-orange-400",
    right: "fill-orange-400 dark:fill-orange-500",
  },
  fence: {
    top: "fill-amber-400",
    left: "fill-amber-400/70",
    right: "fill-amber-500/70",
  },
  glass: {
    top: "fill-sky-200/70 dark:fill-sky-300/60",
    left: "fill-sky-300/60 dark:fill-sky-400/50",
    right: "fill-sky-400/60 dark:fill-sky-500/50",
  },
  rack: {
    top: "fill-blue-500 dark:fill-blue-400",
    left: "fill-blue-600 dark:fill-blue-500",
    right: "fill-blue-700 dark:fill-blue-600",
  },
  forklift: {
    top: "fill-yellow-400",
    left: "fill-yellow-500",
    right: "fill-yellow-600",
  },
  tyre: {
    top: "fill-neutral-800",
    left: "fill-neutral-900",
    right: "fill-neutral-950",
  },
};

const beaconClass: Record<
  ManufactureMachineStatus,
  { fill: string; ring: string }
> = {
  running: { fill: "fill-emerald-400", ring: "stroke-emerald-400" },
  idle: { fill: "fill-slate-300", ring: "stroke-slate-300" },
  down: { fill: "fill-red-500", ring: "stroke-red-500" },
  maintenance: { fill: "fill-amber-400", ring: "stroke-amber-400" },
};
const dotClass: Record<ManufactureMachineStatus, string> = {
  running: "bg-emerald-500",
  idle: "bg-muted-foreground",
  down: "bg-destructive",
  maintenance: "bg-amber-500",
};
const statusOrder: ManufactureMachineStatus[] = [
  "running",
  "idle",
  "down",
  "maintenance",
];

function lineProps(a: Point, b: Point) {
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}

function Box({ part, faded }: { part: ScenePart; faded?: boolean }) {
  const faces = boxFaces(part.x, part.y, part.w, part.d, part.h, ORIGIN);
  const lift = part.z * UNIT_PX;
  const shift = (points: Point[]) =>
    points.map((p) => ({ x: p.x, y: p.y - lift }));
  const tone = toneClass[part.tone];
  return (
    <g
      className={cn(
        "transition-opacity duration-300 motion-reduce:transition-none",
        faded && "opacity-55",
      )}
    >
      <polygon points={polygon(shift(faces.left))} className={tone.left} />
      <polygon points={polygon(shift(faces.right))} className={tone.right} />
      <polygon points={polygon(shift(faces.top))} className={tone.top} />
    </g>
  );
}

function Shell() {
  const { width: W, depth: D, wallHeight: H, lipHeight: L } = WAREHOUSE;
  const backRight = [
    iso(0, 0, 0, ORIGIN),
    iso(W, 0, 0, ORIGIN),
    iso(W, 0, H, ORIGIN),
    iso(0, 0, H, ORIGIN),
  ];
  const backLeft = [
    iso(0, 0, 0, ORIGIN),
    iso(0, D, 0, ORIGIN),
    iso(0, D, H, ORIGIN),
    iso(0, 0, H, ORIGIN),
  ];
  const frontRight = [
    iso(W, 0, 0, ORIGIN),
    iso(W, D, 0, ORIGIN),
    iso(W, D, L, ORIGIN),
    iso(W, 0, L, ORIGIN),
  ];
  const frontLeft = [
    iso(0, D, 0, ORIGIN),
    iso(W, D, 0, ORIGIN),
    iso(W, D, L, ORIGIN),
    iso(0, D, L, ORIGIN),
  ];
  const door = [
    iso(11.4, 0, 0, ORIGIN),
    iso(13.6, 0, 0, ORIGIN),
    iso(13.6, 0, 2.4, ORIGIN),
    iso(11.4, 0, 2.4, ORIGIN),
  ];
  const windows = [1.5, 4.5, 7.5].map((y) => [
    iso(0, y, 1.9, ORIGIN),
    iso(0, y + 1.8, 1.9, ORIGIN),
    iso(0, y + 1.8, 2.8, ORIGIN),
    iso(0, y, 2.8, ORIGIN),
  ]);
  return (
    <g aria-hidden="true">
      <polygon
        points={polygon(floorTile(0, 0, W, D, ORIGIN))}
        className="fill-zinc-200 dark:fill-zinc-700"
      />
      {Array.from({ length: W - 1 }, (_, i) => (
        <line
          key={`gx${i}`}
          {...lineProps(iso(i + 1, 0, 0, ORIGIN), iso(i + 1, D, 0, ORIGIN))}
          className="stroke-zinc-300/70 dark:stroke-zinc-600/70"
          strokeWidth={0.6}
        />
      ))}
      {Array.from({ length: Math.floor(D) }, (_, i) => (
        <line
          key={`gy${i}`}
          {...lineProps(iso(0, i + 1, 0, ORIGIN), iso(W, i + 1, 0, ORIGIN))}
          className="stroke-zinc-300/70 dark:stroke-zinc-600/70"
          strokeWidth={0.6}
        />
      ))}
      {floorLanes.map((lane, i) => (
        <polygon
          key={i}
          points={polygon(floorTile(lane.x, lane.y, lane.w, lane.d, ORIGIN))}
          className="fill-yellow-400/80"
        />
      ))}
      <polygon
        points={polygon(backRight)}
        className="fill-zinc-300 dark:fill-zinc-600"
      />
      <polygon
        points={polygon(backLeft)}
        className="fill-zinc-400 dark:fill-zinc-500"
      />
      <polygon
        points={polygon(door)}
        className="fill-zinc-500 stroke-zinc-600 dark:fill-zinc-800 dark:stroke-zinc-900"
        strokeWidth={1}
      />
      {[0.6, 1.2, 1.8].map((z) => (
        <line
          key={z}
          {...lineProps(iso(11.4, 0, z, ORIGIN), iso(13.6, 0, z, ORIGIN))}
          className="stroke-zinc-600 dark:stroke-zinc-900"
          strokeWidth={0.8}
        />
      ))}
      {windows.map((win, i) => (
        <polygon
          key={i}
          points={polygon(win)}
          className="fill-sky-200/80 dark:fill-sky-300/40"
        />
      ))}
      <polygon
        points={polygon(frontLeft)}
        className="fill-zinc-400 dark:fill-zinc-500"
      />
      <polygon
        points={polygon(frontRight)}
        className="fill-zinc-500 dark:fill-zinc-600"
      />
    </g>
  );
}

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

export function ManufactureMachineBoard({
  machines,
  latestId,
}: {
  machines: ManufactureMachine[];
  latestId: string | null;
}) {
  // null = nothing selected: the whole scene shows at full strength.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = machines.find((machine) => machine.id === selectedId);
  const focusing = selected !== undefined;
  const sceneRef = useRef<HTMLDivElement>(null);

  // Clear the selection on a click outside the scene and inspector, or on Escape.
  useEffect(() => {
    if (!focusing) return;
    function onPointerDown(event: PointerEvent) {
      const scene = sceneRef.current;
      if (
        scene &&
        event.target instanceof Node &&
        !scene.contains(event.target)
      ) {
        setSelectedId(null);
      }
    }
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setSelectedId(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [focusing]);

  // A click on empty floor, walls or props (not on a machine) clears the selection.
  function onSceneClick(event: MouseEvent<SVGSVGElement>) {
    if (
      event.target instanceof Element &&
      !event.target.closest("[data-machine]")
    ) {
      setSelectedId(null);
    }
  }
  const byId = new Map(machines.map((machine) => [machine.id, machine]));
  const running = machines.filter(
    (machine) => machine.status === "running",
  ).length;
  const down = machines.filter((machine) => machine.status === "down").length;

  // Painter's order across props and machine parts: farther (smaller x + y) first.
  const drawables = [
    ...sceneProps.map((part) => ({ part, machineId: null as string | null })),
    ...machineSprites.flatMap((sprite) =>
      sprite.parts.map((part) => ({
        part: { ...part, x: part.x + sprite.x, y: part.y + sprite.y },
        machineId: sprite.machineId,
      })),
    ),
  ].sort((a, b) => sortKey(a.part) - sortKey(b.part));

  function keySelect(event: KeyboardEvent<SVGGElement>, id: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedId(id);
    }
  }

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Production warehouse</CardTitle>
        <CardDescription>
          {running} of {machines.length} machines running
          {down ? `, ${down} down` : ""}. Beacons show status; pick a machine on
          the floor to inspect it, click empty space or press Escape to clear.
          Sensors update every 5 seconds.
        </CardDescription>
      </CardHeader>
      <CardContent
        ref={sceneRef}
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]"
      >
        <div className="flex min-w-0 flex-col gap-3">
          <svg
            viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
            className="h-auto w-full rounded-lg bg-muted/40"
            role="group"
            aria-label="Isometric cutaway of the production warehouse with its machines"
            onClick={onSceneClick}
          >
            <g
              className={cn(
                "transition-opacity duration-300 motion-reduce:transition-none",
                focusing && "opacity-70",
              )}
            >
              <Shell />
            </g>
            {machineSprites
              .filter((sprite) => sprite.machineId === selected?.id)
              .map((sprite) => (
                <polygon
                  key={sprite.machineId}
                  points={polygon(
                    floorTile(
                      sprite.x - 0.3,
                      sprite.y - 0.3,
                      sprite.w + 0.6,
                      sprite.d + 0.6,
                      ORIGIN,
                    ),
                  )}
                  className="fill-ring/40 stroke-ring"
                  strokeWidth={2}
                />
              ))}
            {drawables.map((item, index) => (
              <Box
                key={index}
                part={item.part}
                faded={focusing && item.machineId !== selected?.id}
              />
            ))}
            {/* Selected machine drawn again on top, outlined, so it pops. */}
            {machineSprites
              .filter((sprite) => sprite.machineId === selected?.id)
              .flatMap((sprite) =>
                sprite.parts
                  .map((part) => ({
                    ...part,
                    x: part.x + sprite.x,
                    y: part.y + sprite.y,
                  }))
                  .sort((a, b) => sortKey(a) - sortKey(b)),
              )
              .map((part, index) => (
                <g
                  key={`selected-${index}`}
                  className="[&>polygon]:stroke-ring [&>polygon]:[stroke-width:1.25] [&>polygon]:[stroke-linejoin:round]"
                >
                  <Box part={part} />
                </g>
              ))}
            {machineSprites.map((sprite) => {
              const machine = byId.get(sprite.machineId);
              if (!machine) return null;
              const style = machineStatusStyles[machine.status];
              const beacon = beaconClass[machine.status];
              const over = isOverThreshold(machine);
              const at = iso(
                sprite.x + sprite.beacon.x,
                sprite.y + sprite.beacon.y,
                sprite.beacon.z,
                ORIGIN,
              );
              const fresh = machine.id === latestId;
              const isSelected = machine.id === selected?.id;
              // Hit area: the footprint extruded up to the wall height.
              const hit = floorTile(
                sprite.x,
                sprite.y,
                sprite.w,
                sprite.d,
                ORIGIN,
              ).map((p, i) => ({
                x: p.x,
                y: i < 2 ? p.y - WAREHOUSE.wallHeight * UNIT_PX : p.y,
              }));
              return (
                <g
                  key={sprite.machineId}
                  data-machine={machine.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${machine.name} (${machine.id}), ${style.label}${over.temp || over.vibration ? ", sensor above limit" : ""}`}
                  className={cn(
                    "cursor-pointer outline-none transition-opacity duration-300 motion-reduce:transition-none",
                    focusing &&
                      !isSelected &&
                      "opacity-75 hover:opacity-100 focus-visible:opacity-100",
                  )}
                  onClick={() => setSelectedId(machine.id)}
                  onKeyDown={(event) => keySelect(event, machine.id)}
                >
                  <polygon
                    points={polygon(hit)}
                    fill="transparent"
                    className="stroke-transparent [stroke-width:2] [g:focus-visible>&]:stroke-ring"
                  />
                  <line
                    x1={at.x}
                    y1={at.y}
                    x2={at.x}
                    y2={at.y + 10}
                    className="stroke-foreground/50"
                    strokeWidth={1}
                  />
                  <circle
                    cx={at.x}
                    cy={at.y}
                    r={isSelected ? 5.5 : 4}
                    className={cn(
                      beacon.fill,
                      fresh && "motion-safe:animate-pulse",
                    )}
                  />
                  <circle
                    cx={at.x}
                    cy={at.y}
                    r={isSelected ? 9 : 6.5}
                    fill="none"
                    className={cn(
                      beacon.ring,
                      isSelected ? "opacity-70" : "opacity-40",
                    )}
                    strokeWidth={1.5}
                  />
                  <text
                    x={at.x}
                    y={at.y - (isSelected ? 13 : 10)}
                    textAnchor="middle"
                    className={cn(
                      "fill-foreground font-semibold tabular-nums",
                      isSelected ? "text-xs" : "text-[0.625rem]",
                    )}
                  >
                    {machine.id}
                  </text>
                </g>
              );
            })}
          </svg>
          <dl className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            {statusOrder.map((status) => (
              <div key={status} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={cn("size-2.5 rounded-full", dotClass[status])}
                />
                <dt className="text-muted-foreground">
                  {machineStatusStyles[status].label}
                </dt>
                <dd className="font-medium tabular-nums">
                  {machines.filter((m) => m.status === status).length}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside
          aria-live="polite"
          className="flex flex-col gap-4 rounded-lg border border-border p-3"
        >
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {selected.name}
                  </p>
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
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Whole floor</p>
              <p className="text-xs text-muted-foreground">
                No machine selected. Pick one on the floor or in the list to
                inspect its sensors.
              </p>
            </div>
          )}
          <ul className="mt-auto flex flex-col gap-1 border-t border-border pt-3">
            {machines.map((machine) => (
              <li key={machine.id}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedId((current) =>
                      current === machine.id ? null : machine.id,
                    )
                  }
                  aria-pressed={machine.id === selected?.id}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs hover:bg-muted aria-pressed:bg-muted"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      dotClass[machine.status],
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
      </CardContent>
    </Card>
  );
}
