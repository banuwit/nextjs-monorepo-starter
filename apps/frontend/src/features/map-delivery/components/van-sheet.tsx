"use client";

import { useState } from "react";
import { SnowflakeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { controlsSchema } from "../schemas/map-delivery.schema";
import type { DriveMode, FleetState, Van, VanControls } from "../types/map-delivery";
import {
  bodyLabels,
  formatClock,
  formatWindow,
  isAtRisk,
  parcelsOnBoard,
  powertrainLabels,
  routeNeedKm,
  statusLabels,
  statusTone,
  stopsForVan,
} from "../utils/map-delivery";
import { VehicleArt } from "./vehicle-art";

type VanSheetProps = {
  state: FleetState;
  van: Van | null;
  color: string;
  onClose: () => void;
  onSaveControls: (vanId: string, controls: VanControls) => void;
};

export function VanSheet({ state, van, color, onClose, onSaveControls }: VanSheetProps) {
  return (
    <Sheet open={!!van} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg">
        {van && (
          <VanSheetBody
            key={van.id}
            state={state}
            van={van}
            color={color}
            onSaveControls={onSaveControls}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function VanSheetBody({
  state,
  van,
  color,
  onSaveControls,
}: {
  state: FleetState;
  van: Van;
  color: string;
  onSaveControls: (vanId: string, controls: VanControls) => void;
}) {
  const driver = state.drivers.find((item) => item.id === van.driverId);
  const area = state.areas.find((item) => item.id === van.areaId);
  const load = parcelsOnBoard(van, state.stops);
  const [view, setView] = useState<"iso" | "2d">("iso");
  const [controls, setControls] = useState<VanControls>(van.controls);
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(controls) !== JSON.stringify(van.controls);
  const patch = (value: Partial<VanControls>) => {
    setSaved(false);
    setControls((current) => ({ ...current, ...value }));
  };

  function save() {
    const parsed = controlsSchema.safeParse(controls);
    if (!parsed.success) return;
    onSaveControls(van.id, parsed.data);
    setSaved(true);
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center gap-2">
          {van.name}
          <Badge className={cn("border-transparent", statusTone[van.status])}>{statusLabels[van.status]}</Badge>
        </SheetTitle>
        <SheetDescription>
          {bodyLabels[van.body]} · {powertrainLabels[van.powertrain]} · {driver?.name ?? "Unassigned"}
        </SheetDescription>
      </SheetHeader>
      <Tabs defaultValue="overview" className="min-h-0 flex-1 px-4 pb-4">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="route">Route</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">{load}</strong> of {van.capacity} parcels on board
            </p>
            <ToggleGroup value={[view]} onValueChange={(value) => value[0] && setView(value[0] as "iso" | "2d")} size="sm" variant="outline">
              <ToggleGroupItem value="iso" aria-label="Isometric view">Iso</ToggleGroupItem>
              <ToggleGroupItem value="2d" aria-label="Side view">2D</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex justify-center rounded-xl border border-border bg-muted/40 p-4">
            <VehicleArt body={van.body} color={color} parcels={load} capacity={van.capacity} view={view} />
          </div>
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <Row label="Range" value={`${Math.round(van.rangeKm)} km`} />
            <Row label="Route needs" value={`${Math.round(routeNeedKm(van, state.stops, state.depot))} km`} />
            <Row label={van.powertrain === "ev" ? "Charge" : "Fuel"} value={`${van.energyPct.toFixed(0)}%`} />
            <Row label="Back at depot" value={formatClock(van.returnEta)} />
            {van.cargoTempC !== undefined && <Row label="Cargo temp" value={`${van.cargoTempC.toFixed(1)} °C`} />}
            <Row label="Area" value={area?.name ?? "—"} />
          </dl>
        </TabsContent>

        <TabsContent value="vehicle" className="overflow-y-auto">
          <dl className="grid grid-cols-2 gap-2 text-xs">
            <Row label="Call sign" value={van.name} />
            <Row label="Plate" value={van.plate} />
            <Row label="Body" value={bodyLabels[van.body]} />
            <Row label="Powertrain" value={powertrainLabels[van.powertrain]} />
            <Row label="Capacity" value={`${van.capacity} parcels`} />
            <Row label="Driver" value={driver?.name ?? "Unassigned"} />
            <Row label="Phone" value={driver?.phone ?? "—"} />
            <Row label="Heading" value={`${Math.round(van.heading)}°`} />
            <Row label="Position" value={`${van.position[1].toFixed(4)}, ${van.position[0].toFixed(4)}`} />
          </dl>
        </TabsContent>

        <TabsContent value="controls" className="flex flex-col gap-5 overflow-y-auto">
          <Field>
            <FieldLabel>Drive mode</FieldLabel>
            <ToggleGroup
              value={[controls.driveMode]}
              onValueChange={(value) => value[0] && patch({ driveMode: value[0] as DriveMode })}
              variant="outline"
              className="w-full *:flex-1"
            >
              <ToggleGroupItem value="eco">Eco</ToggleGroupItem>
              <ToggleGroupItem value="normal">Normal</ToggleGroupItem>
              <ToggleGroupItem value="sport">Sport</ToggleGroupItem>
            </ToggleGroup>
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <Label htmlFor="ctl-speed">Speed governor</Label>
              <span className="text-xs tabular-nums text-muted-foreground">{controls.speedLimit} mph</span>
            </div>
            <Slider
              id="ctl-speed"
              min={45}
              max={75}
              step={5}
              value={[controls.speedLimit]}
              onValueChange={(value) => patch({ speedLimit: Array.isArray(value) ? value[0]! : value })}
              aria-label="Speed governor"
            />
            <FieldDescription>Between 45 and 75 mph.</FieldDescription>
          </Field>
          {van.powertrain === "ev" ? (
            <Field>
              <div className="flex items-center justify-between">
                <Label htmlFor="ctl-charge">Charge limit</Label>
                <span className="text-xs tabular-nums text-muted-foreground">{controls.chargeLimit ?? 90}%</span>
              </div>
              <Slider
                id="ctl-charge"
                min={50}
                max={100}
                step={5}
                value={[controls.chargeLimit ?? 90]}
                onValueChange={(value) => patch({ chargeLimit: Array.isArray(value) ? value[0]! : value })}
                aria-label="Charge limit"
              />
            </Field>
          ) : (
            <Field>
              <div className="flex items-center justify-between">
                <Label htmlFor="ctl-refuel">Refuel alert</Label>
                <span className="text-xs tabular-nums text-muted-foreground">at {controls.refuelAlert ?? 20}%</span>
              </div>
              <Slider
                id="ctl-refuel"
                min={5}
                max={50}
                step={5}
                value={[controls.refuelAlert ?? 20]}
                onValueChange={(value) => patch({ refuelAlert: Array.isArray(value) ? value[0]! : value })}
                aria-label="Refuel alert"
              />
            </Field>
          )}
          {van.body === "reefer" && (
            <Field>
              <div className="flex items-center justify-between">
                <Label htmlFor="ctl-cold" className="flex items-center gap-1">
                  <SnowflakeIcon className="size-3.5 text-sky-500" /> Cold setpoint
                </Label>
                <span className="text-xs tabular-nums text-muted-foreground">{controls.coldSetpoint ?? 3} °C</span>
              </div>
              <Slider
                id="ctl-cold"
                min={-20}
                max={8}
                step={1}
                value={[controls.coldSetpoint ?? 3]}
                onValueChange={(value) => patch({ coldSetpoint: Array.isArray(value) ? value[0]! : value })}
                aria-label="Cold setpoint"
              />
            </Field>
          )}
          <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
            <SwitchRow id="ctl-lane" label="Lane assist" checked={controls.laneAssist} onChange={(laneAssist) => patch({ laneAssist })} />
            <SwitchRow id="ctl-brake" label="Automatic emergency braking" checked={controls.autoBrake} onChange={(autoBrake) => patch({ autoBrake })} />
            <SwitchRow id="ctl-geo" label="Geofence alerts" checked={controls.geofence} onChange={(geofence) => patch({ geofence })} />
          </div>
          <div className="flex items-center justify-end gap-2">
            {saved && <span className="text-xs text-muted-foreground" role="status">Saved</span>}
            <Button variant="outline" size="sm" disabled={!dirty} onClick={() => setControls(van.controls)}>Discard</Button>
            <Button size="sm" disabled={!dirty} onClick={save}>Save controls</Button>
          </div>
        </TabsContent>

        <TabsContent value="route" className="overflow-y-auto">
          <ol className="flex flex-col divide-y divide-border text-xs">
            {stopsForVan(state.stops, van.id).map((stop, index) => (
              <li key={stop.id} className="flex items-start gap-2 py-2">
                <span className="w-5 shrink-0 text-right tabular-nums text-muted-foreground">{index + 1}.</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{stop.recipient}</div>
                  <div className="truncate text-muted-foreground">{stop.merchant} · {stop.address}</div>
                  <div className="text-muted-foreground">{formatWindow(stop.window)}</div>
                </div>
                <div className="text-right">
                  <div className={cn("tabular-nums", isAtRisk(stop) && "font-medium text-orange-600 dark:text-orange-300")}>
                    {formatClock(stop.status === "to-go" ? stop.eta : (stop.completedAt ?? stop.eta))}
                  </div>
                  <div className="text-muted-foreground capitalize">{stop.status.replace("-", " ")}</div>
                </div>
              </li>
            ))}
          </ol>
        </TabsContent>

        <TabsContent value="activity" className="overflow-y-auto">
          <ol className="flex flex-col gap-2 text-xs">
            {van.activity.map((entry, index) => (
              <li key={`${entry.at}-${index}`} className="flex gap-3">
                <span className="w-14 shrink-0 tabular-nums text-muted-foreground">{formatClock(entry.at)}</span>
                <span>{entry.message}</span>
              </li>
            ))}
            {van.activity.length === 0 && <li className="text-muted-foreground">No activity yet today.</li>}
          </ol>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border px-2.5 py-2">
      <dt className="text-[0.6875rem] text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function SwitchRow({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor={id} className="text-sm font-normal">{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
