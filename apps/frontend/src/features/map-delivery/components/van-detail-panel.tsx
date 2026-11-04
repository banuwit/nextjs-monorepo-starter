"use client";

import {
  ArrowLeftIcon,
  CalendarClockIcon,
  CheckIcon,
  ChevronRightIcon,
  CrosshairIcon,
  SnowflakeIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { FleetState, Stop, Van } from "../types/map-delivery";
import {
  bodyLabels,
  formatClock,
  formatWindow,
  isAtRisk,
  parcelsOnBoard,
  routeNeedKm,
  statusLabels,
  statusTone,
  stopsForVan,
} from "../utils/map-delivery";

export type StopAction = "deliver" | "fail" | "reschedule" | "reassign";

type VanDetailPanelProps = {
  state: FleetState;
  van: Van;
  follow: boolean;
  onBack: () => void;
  onToggleFollow: () => void;
  onOpenSheet: () => void;
  onStopAction: (action: StopAction, stop: Stop) => void;
};

export function VanDetailPanel({
  state,
  van,
  follow,
  onBack,
  onToggleFollow,
  onOpenSheet,
  onStopAction,
}: VanDetailPanelProps) {
  const driver = state.drivers.find((item) => item.id === van.driverId);
  const route = stopsForVan(state.stops, van.id);
  const need = routeNeedKm(van, state.stops, state.depot);
  const short = need > van.rangeKm;
  const load = parcelsOnBoard(van, state.stops);
  const next = route.find((stop) => stop.status === "to-go");
  const tempOff =
    van.cargoTempC !== undefined &&
    van.controls.coldSetpoint !== undefined &&
    van.cargoTempC > van.controls.coldSetpoint + 2;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Back to fleet overview">
          <ArrowLeftIcon />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{van.name}</h3>
            <Badge className={cn("border-transparent", statusTone[van.status])}>{statusLabels[van.status]}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {bodyLabels[van.body]} · {van.plate} ·{" "}
            <UserRoundIcon className="inline size-3 align-[-1px]" /> {driver?.name ?? "Unassigned"}
          </p>
        </div>
        <Button
          variant={follow ? "default" : "outline"}
          size="icon-sm"
          onClick={onToggleFollow}
          aria-pressed={follow}
          aria-label={follow ? "Stop following" : "Follow on map"}
        >
          <CrosshairIcon />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Gauge
          label="Range vs route"
          value={`${Math.round(van.rangeKm)} km`}
          hint={`${short ? "short by" : "spare"} ${Math.round(Math.abs(van.rangeKm - need))} km`}
          pct={Math.min((van.rangeKm / Math.max(need, 1)) * 100, 100)}
          warn={short}
        />
        <Gauge
          label="Load"
          value={`${load} / ${van.capacity}`}
          hint={`${van.energyPct.toFixed(0)}% ${van.powertrain === "ev" ? "charge" : "fuel"}`}
          pct={(load / van.capacity) * 100}
        />
        {van.cargoTempC !== undefined && (
          <div
            className={cn(
              "col-span-2 flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs",
              tempOff ? "border-sky-500/40 bg-sky-500/10" : "border-border bg-background/60",
            )}
          >
            <SnowflakeIcon className="size-4 text-sky-600 dark:text-sky-300" />
            <span>
              Cargo <strong className="tabular-nums">{van.cargoTempC.toFixed(1)} °C</strong>
            </span>
            <span className="ml-auto text-muted-foreground">
              setpoint {van.controls.coldSetpoint ?? "—"} °C
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Back at depot <strong className="text-foreground">{formatClock(van.returnEta)}</strong>
        </span>
        <Button variant="link" size="sm" className="h-auto p-0" onClick={onOpenSheet}>
          Vehicle sheet <ChevronRightIcon />
        </Button>
      </div>

      <section className="flex flex-col gap-1.5">
        <h4 className="text-xs font-medium text-muted-foreground">
          Stops in road order <span className="text-foreground">{route.length}</span>
        </h4>
        <ol className="flex flex-col gap-1">
          {route.map((stop, index) => {
            const risk = isAtRisk(stop);
            const isNext = stop.id === next?.id;
            return (
              <li
                key={stop.id}
                className={cn(
                  "rounded-lg border px-2.5 py-2 text-xs",
                  isNext ? "border-primary/40 bg-primary/5" : "border-border",
                  stop.status !== "to-go" && "opacity-70",
                )}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-semibold",
                      stop.status === "delivered" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                      stop.status === "failed" && "bg-red-500/15 text-red-700 dark:text-red-300",
                      stop.status === "to-go" && (risk ? "bg-orange-500/15 text-orange-700 dark:text-orange-300" : "bg-muted text-muted-foreground"),
                    )}
                  >
                    {stop.status === "delivered" ? <CheckIcon className="size-3" /> : stop.status === "failed" ? <XIcon className="size-3" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-medium">{stop.recipient}</span>
                      {stop.coldChain && <SnowflakeIcon className="size-3 shrink-0 text-sky-500" aria-label="Cold chain" />}
                    </div>
                    <div className="truncate text-muted-foreground">{stop.address}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-muted-foreground">
                      <span>{formatWindow(stop.window)}</span>
                      <span className={cn(risk && "font-medium text-orange-600 dark:text-orange-300")}>
                        {stop.status === "to-go" ? `ETA ${formatClock(stop.eta)}` : `${stop.status} ${stop.completedAt ? formatClock(stop.completedAt) : ""}`}
                      </span>
                    </div>
                  </div>
                  {stop.status === "to-go" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-xs" aria-label={`Move ${stop.recipient}`} />}
                      >
                        <CalendarClockIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onStopAction("reschedule", stop)}>Move to a later window</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStopAction("reassign", stop)}>Hand to another van</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {isNext && van.status !== "breakdown" && (
                  <div className="mt-2 flex gap-1.5">
                    <Button size="xs" onClick={() => onStopAction("deliver", stop)}>
                      <CheckIcon /> Delivered
                    </Button>
                    <Button size="xs" variant="outline" onClick={() => onStopAction("fail", stop)}>
                      <XIcon /> Failed
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
          {route.length === 0 && (
            <li className="rounded-lg border border-dashed px-2.5 py-3 text-center text-xs text-muted-foreground">
              No stops planned for this van.
            </li>
          )}
        </ol>
      </section>
    </div>
  );
}

function Gauge({ label, value, hint, pct, warn }: { label: string; value: string; hint: string; pct: number; warn?: boolean }) {
  return (
    <div className={cn("rounded-lg border px-2.5 py-2", warn ? "border-amber-500/40 bg-amber-500/10" : "border-border bg-background/60")}>
      <div className="text-[0.6875rem] text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums">{value}</div>
      <Progress
        value={pct}
        aria-label={label}
        className={cn("my-1", warn && "[&_[data-slot=progress-indicator]]:bg-amber-500")}
      />
      <div className="text-[0.6875rem] text-muted-foreground">{hint}</div>
    </div>
  );
}
