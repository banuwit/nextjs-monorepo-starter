"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

function detectWebGL2() {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = Boolean(canvas.getContext("webgl2"));
  } catch {
    cached = false;
  }
  return cached;
}

const subscribe = () => () => undefined;

/** `null` during server render and hydration, then whether WebGL 2 is available. */
export function useWebGLSupport() {
  return useSyncExternalStore<boolean | null>(
    subscribe,
    detectWebGL2,
    () => null,
  );
}
