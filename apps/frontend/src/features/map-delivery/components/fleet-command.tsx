"use client";

import { useEffect } from "react";
import { MapPinIcon, StoreIcon, TruckIcon, UserRoundIcon, MapIcon } from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { FleetState } from "../types/map-delivery";
import { formatClock, statusLabels } from "../utils/map-delivery";

export type FleetCommandTarget =
  | { type: "van"; vanId: string }
  | { type: "stop"; stopId: string }
  | { type: "area"; areaId: string };

type FleetCommandProps = {
  state: FleetState;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (target: FleetCommandTarget) => void;
};

/** ⌘K / Ctrl+K palette over vehicles, drivers, stops, merchants and areas. */
export function FleetCommand({ state, open, onOpenChange, onSelect }: FleetCommandProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const pick = (target: FleetCommandTarget) => {
    onSelect(target);
    onOpenChange(false);
  };
  const active = state.vans.filter((van) => van.status !== "retired");
  const merchants = [...new Set(state.stops.map((stop) => stop.merchant))].sort();

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Fleet search" description="Jump to a van, driver, stop, merchant, or area" className="sm:max-w-lg">
      <Command>
        <CommandInput placeholder="Search vehicles, drivers, stops, merchants, areas…" />
        <CommandList className="max-h-80">
          <CommandEmpty>Nothing matches.</CommandEmpty>
          <CommandGroup heading="Vehicles">
            {active.map((van) => (
              <CommandItem key={van.id} value={`${van.name} ${van.plate}`} onSelect={() => pick({ type: "van", vanId: van.id })}>
                <TruckIcon />
                <span>{van.name}</span>
                <span className="text-xs text-muted-foreground">{van.plate} · {statusLabels[van.status]}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Drivers">
            {state.drivers.map((driver) => {
              const van = active.find((item) => item.driverId === driver.id);
              return (
                <CommandItem key={driver.id} value={`driver ${driver.name}`} disabled={!van} onSelect={() => van && pick({ type: "van", vanId: van.id })}>
                  <UserRoundIcon />
                  <span>{driver.name}</span>
                  <span className="text-xs text-muted-foreground">{van ? van.name : "Not driving today"}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="Stops">
            {state.stops.map((stop) => (
              <CommandItem key={stop.id} value={`stop ${stop.recipient} ${stop.address}`} onSelect={() => pick({ type: "stop", stopId: stop.id })}>
                <MapPinIcon />
                <span className="truncate">{stop.recipient}</span>
                <span className="truncate text-xs text-muted-foreground">{stop.address} · ETA {formatClock(stop.eta)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Merchants">
            {merchants.map((merchant) => {
              const stop = state.stops.find((item) => item.merchant === merchant && item.status === "to-go") ?? state.stops.find((item) => item.merchant === merchant);
              return (
                <CommandItem key={merchant} value={`merchant ${merchant}`} onSelect={() => stop && pick({ type: "stop", stopId: stop.id })}>
                  <StoreIcon />
                  <span>{merchant}</span>
                  <span className="text-xs text-muted-foreground">
                    {state.stops.filter((item) => item.merchant === merchant).length} stops
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="Areas">
            {state.areas.map((area) => (
              <CommandItem key={area.id} value={`area ${area.name}`} onSelect={() => pick({ type: "area", areaId: area.id })}>
                <MapIcon />
                <span>{area.name}</span>
                <span className="text-xs text-muted-foreground">
                  {active.filter((van) => van.areaId === area.id).length} vans
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
