"use client";

import { useEffect, useState } from "react";

import {
  manufactureMachines,
  manufactureReadingDeltas,
  manufactureUnitsPerTick,
} from "@/mocks/dashboard-manufacture.mock";

import type { ManufactureMachine } from "../types/manufacture";
import { stepMachines } from "../utils/manufacture";

const TICK_MS = 5_000;

type LiveState = {
  clock: number;
  machines: ManufactureMachine[];
  tick: number;
  extraUnits: number;
  latestId: string | null;
};

function initialState(now: number): LiveState {
  return {
    clock: now,
    machines: manufactureMachines,
    tick: 0,
    extraUnits: 0,
    latestId: null,
  };
}

/**
 * Simulates a live sensor feed on top of the sample machines. Every tick one
 * running machine gets a new temperature and vibration reading until paused.
 */
export function useMachineLive(now: number) {
  const [state, setState] = useState(() => initialState(now));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setState((current) => {
        const step = stepMachines(
          current.machines,
          current.tick,
          manufactureReadingDeltas,
        );
        return {
          clock: Date.now(),
          machines: step.machines,
          tick: current.tick + 1,
          extraUnits: current.extraUnits + manufactureUnitsPerTick,
          latestId: step.latestId,
        };
      });
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  return { ...state, paused, setPaused };
}
