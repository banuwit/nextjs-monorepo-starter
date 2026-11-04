"use client";

import { useCallback, useEffect, useReducer } from "react";

import { initialFleet } from "@/mocks/map-delivery.mock";
import type {
  DeliveryDraft,
  FailReason,
  FleetException,
  FleetState,
  LngLat,
  Stop,
  TimeWindow,
  Van,
  VanControls,
  VanDraft,
} from "../types/map-delivery";
import {
  addMinutes,
  bearing,
  distanceKm,
  nextId,
  nextStop,
  openStops,
  routeNeedKm,
  stepToward,
  stopsForVan,
  toMinutes,
} from "../utils/map-delivery";

type Action =
  | { type: "deliver"; stopId: string }
  | { type: "fail"; stopId: string; reason: FailReason; note: string }
  | { type: "reschedule"; stopId: string; window: TimeWindow }
  | { type: "reassign"; stopId: string; vanId: string }
  | { type: "acknowledge"; exceptionId: string }
  | { type: "message-driver"; vanId: string }
  | { type: "add-van"; draft: VanDraft }
  | { type: "edit-van"; vanId: string; draft: VanDraft }
  | { type: "retire-van"; vanId: string }
  | { type: "controls"; vanId: string; controls: VanControls }
  | { type: "add-delivery"; draft: DeliveryDraft }
  | { type: "tick" };

function log(van: Van, now: string, message: string): Van {
  return { ...van, activity: [{ at: now, message }, ...van.activity].slice(0, 20) };
}

function updateVan(state: FleetState, vanId: string, update: (van: Van) => Van) {
  return state.vans.map((van) => (van.id === vanId ? update(van) : van));
}

/** Re-space ETAs after a stop is removed, added or reordered. */
function replanEtas(state: FleetState, vanId: string): Stop[] {
  const van = state.vans.find((item) => item.id === vanId);
  if (!van) return state.stops;
  const route = openStops(stopsForVan(state.stops, vanId));
  let clock = Math.max(toMinutes(state.now), 0);
  let cursor = van.position;
  const etas = new Map<string, string>();
  for (const stop of route) {
    // ~22 km/h in the city plus 6 minutes at the door.
    clock += Math.round((distanceKm(cursor, stop.position) * 1.35) / 22 * 60) + 6;
    etas.set(stop.id, addMinutes("00:00", clock));
    cursor = stop.position;
  }
  return state.stops.map((stop) =>
    etas.has(stop.id) ? { ...stop, eta: etas.get(stop.id)! } : stop,
  );
}

function withReturnEta(state: FleetState, vanId: string): FleetState {
  const route = openStops(stopsForVan(state.stops, vanId));
  const last = route.at(-1);
  const van = state.vans.find((item) => item.id === vanId);
  if (!van) return state;
  const back = last
    ? addMinutes(last.eta, Math.round((distanceKm(last.position, state.depot) * 1.35) / 22 * 60))
    : addMinutes(state.now, Math.round((distanceKm(van.position, state.depot) * 1.35) / 22 * 60));
  return { ...state, vans: updateVan(state, vanId, (item) => ({ ...item, returnEta: back })) };
}

function closeStopExceptions(exceptions: FleetException[], stopId: string) {
  return exceptions.map((item) =>
    item.stopId === stopId ? { ...item, acknowledged: true } : item,
  );
}

function reducer(state: FleetState, action: Action): FleetState {
  switch (action.type) {
    case "deliver": {
      const stop = state.stops.find((item) => item.id === action.stopId);
      if (!stop || stop.status !== "to-go") return state;
      const stops = state.stops.map((item) =>
        item.id === stop.id
          ? { ...item, status: "delivered" as const, completedAt: state.now }
          : item,
      );
      const next = { ...state, stops, exceptions: closeStopExceptions(state.exceptions, stop.id) };
      const remaining = openStops(stopsForVan(stops, stop.vanId)).length;
      return withReturnEta(
        {
          ...next,
          vans: updateVan(next, stop.vanId, (van) =>
            log(
              { ...van, position: stop.position, status: remaining ? van.status : "returning" },
              state.now,
              `Delivered ${stop.parcels} parcel${stop.parcels === 1 ? "" : "s"} to ${stop.recipient}`,
            ),
          ),
        },
        stop.vanId,
      );
    }
    case "fail": {
      const stop = state.stops.find((item) => item.id === action.stopId);
      if (!stop || stop.status !== "to-go") return state;
      const stops = state.stops.map((item) =>
        item.id === stop.id
          ? {
              ...item,
              status: "failed" as const,
              failReason: action.reason,
              completedAt: state.now,
              note: action.note || item.note,
            }
          : item,
      );
      const exception: FleetException = {
        id: nextId("exc"),
        kind: "failed-attempt",
        vanId: stop.vanId,
        stopId: stop.id,
        message: `Failed attempt at ${stop.recipient}: ${action.reason.replace("-", " ")}. ${stop.parcels} parcel${stop.parcels === 1 ? "" : "s"} still on board.`,
        at: state.now,
        acknowledged: false,
      };
      const next = { ...state, stops, exceptions: [exception, ...state.exceptions] };
      return withReturnEta(
        {
          ...next,
          vans: updateVan(next, stop.vanId, (van) =>
            log({ ...van, position: stop.position }, state.now, `Failed attempt at ${stop.recipient}`),
          ),
        },
        stop.vanId,
      );
    }
    case "reschedule": {
      const stop = state.stops.find((item) => item.id === action.stopId);
      if (!stop || stop.status !== "to-go") return state;
      let next: FleetState = {
        ...state,
        stops: state.stops.map((item) =>
          item.id === stop.id
            ? { ...item, window: action.window, eta: action.window.start }
            : item,
        ),
        exceptions: closeStopExceptions(state.exceptions, stop.id),
      };
      next = { ...next, stops: replanEtas(next, stop.vanId) };
      next = {
        ...next,
        vans: updateVan(next, stop.vanId, (van) =>
          log(van, state.now, `${stop.recipient} moved to a later window`),
        ),
      };
      return withReturnEta(next, stop.vanId);
    }
    case "reassign": {
      const stop = state.stops.find((item) => item.id === action.stopId);
      if (!stop || stop.status !== "to-go" || stop.vanId === action.vanId) return state;
      const from = stop.vanId;
      let next: FleetState = {
        ...state,
        stops: state.stops.map((item) =>
          item.id === stop.id ? { ...item, vanId: action.vanId, eta: "23:59" } : item,
        ),
        exceptions: closeStopExceptions(state.exceptions, stop.id),
      };
      next = { ...next, stops: replanEtas(next, action.vanId) };
      next = { ...next, stops: replanEtas(next, from) };
      const target = next.vans.find((van) => van.id === action.vanId);
      next = {
        ...next,
        vans: next.vans.map((van) => {
          if (van.id === from) return log(van, state.now, `${stop.recipient} handed to ${target?.name ?? "another van"}`);
          if (van.id === action.vanId) return log(van, state.now, `Picked up ${stop.recipient} from the plan`);
          return van;
        }),
      };
      return withReturnEta(withReturnEta(next, from), action.vanId);
    }
    case "acknowledge":
      return {
        ...state,
        exceptions: state.exceptions.map((item) =>
          item.id === action.exceptionId ? { ...item, acknowledged: true } : item,
        ),
      };
    case "message-driver":
      return {
        ...state,
        vans: updateVan(state, action.vanId, (van) =>
          log(van, state.now, "Dispatcher sent a message to the driver"),
        ),
      };
    case "add-van": {
      const area = state.areas.find((item) => item.id === action.draft.areaId);
      const van: Van = {
        id: nextId("van"),
        ...action.draft,
        status: "at-depot",
        position: state.depot,
        heading: 0,
        rangeKm: action.draft.powertrain === "ev" ? 140 : 380,
        energyPct: 100,
        returnEta: state.now,
        cargoTempC: action.draft.body === "reefer" ? 3 : undefined,
        controls: {
          driveMode: "normal",
          speedLimit: action.draft.body === "cargo-bike" ? 45 : 60,
          chargeLimit: action.draft.powertrain === "ev" ? 90 : undefined,
          refuelAlert: action.draft.powertrain === "ev" ? undefined : 20,
          coldSetpoint: action.draft.body === "reefer" ? 3 : undefined,
          laneAssist: true,
          autoBrake: true,
          geofence: true,
        },
        activity: [{ at: state.now, message: `Added to the fleet for ${area?.name ?? "the city"}` }],
      };
      return { ...state, vans: [...state.vans, van] };
    }
    case "edit-van":
      return {
        ...state,
        vans: updateVan(state, action.vanId, (van) =>
          log({ ...van, ...action.draft }, state.now, "Vehicle details updated"),
        ),
      };
    case "retire-van": {
      if (openStops(stopsForVan(state.stops, action.vanId)).length) return state;
      return {
        ...state,
        vans: updateVan(state, action.vanId, (van) =>
          log({ ...van, status: "retired" }, state.now, "Retired from the fleet"),
        ),
      };
    }
    case "controls":
      return {
        ...state,
        vans: updateVan(state, action.vanId, (van) =>
          log({ ...van, controls: action.controls }, state.now, "Vehicle controls updated"),
        ),
      };
    case "add-delivery": {
      const { draft } = action;
      const stop: Stop = {
        id: nextId("stop"),
        vanId: draft.vanId,
        recipient: draft.recipient,
        merchant: draft.merchant,
        address: draft.address,
        note: draft.note || undefined,
        position: draft.position,
        window: { start: draft.windowStart, end: addMinutes(draft.windowStart, 120) },
        eta: "23:59",
        status: "to-go",
        parcels: draft.parcels,
        coldChain: draft.coldChain,
      };
      let next: FleetState = { ...state, stops: [...state.stops, stop] };
      next = { ...next, stops: replanEtas(next, draft.vanId) };
      next = {
        ...next,
        vans: updateVan(next, draft.vanId, (van) =>
          log(
            { ...van, status: van.status === "at-depot" ? "loading" : van.status },
            state.now,
            `New delivery for ${draft.recipient} added to the route`,
          ),
        ),
      };
      return withReturnEta(next, draft.vanId);
    }
    case "tick": {
      // Nudge every moving van toward its next stop so "follow" has something to follow.
      const vans = state.vans.map((van) => {
        if (van.status !== "en-route" && van.status !== "returning") return van;
        const target = van.status === "returning" ? state.depot : nextStop(state.stops, van.id)?.position;
        if (!target) return van;
        const remaining = distanceKm(van.position, target);
        if (remaining < 0.05) return van;
        const fraction = Math.min(0.08 / remaining, 1);
        const position = stepToward(van.position, target, fraction);
        const burn = van.powertrain === "ev" ? 0.12 : 0.05;
        return {
          ...van,
          position,
          heading: bearing(van.position, target),
          rangeKm: Math.max(van.rangeKm - 0.08 * 1.35, 0),
          energyPct: Math.max(van.energyPct - burn, 0),
        };
      });
      return { ...state, vans, now: addMinutes(state.now, 1) };
    }
  }
}

export function useFleet({ live }: { live: boolean }) {
  const [state, dispatch] = useReducer(reducer, initialFleet);

  useEffect(() => {
    if (!live) return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 2500);
    return () => window.clearInterval(timer);
  }, [live]);

  const rangeShortfall = useCallback(
    (van: Van) => Math.max(routeNeedKm(van, state.stops, state.depot) - van.rangeKm, 0),
    [state.stops, state.depot],
  );

  const canRetire = useCallback(
    (vanId: string) => openStops(stopsForVan(state.stops, vanId)).length === 0,
    [state.stops],
  );

  return { state, dispatch, rangeShortfall, canRetire };
}

export type FleetDispatch = (action: Action) => void;
export type { LngLat };
