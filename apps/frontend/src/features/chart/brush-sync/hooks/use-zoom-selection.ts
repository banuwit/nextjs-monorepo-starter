"use client";

import { useState } from "react";
import type { MouseHandlerDataParam } from "recharts";

import type { ZoomDomain } from "@/features/chart/brush-sync/types/brush-sync";

function toValue(state: MouseHandlerDataParam) {
  const value = Number(state.activeLabel);
  return Number.isFinite(value) ? value : undefined;
}

/**
 * Drag-to-zoom state for a chart with a numeric X axis. Spread `handlers`
 * on the Recharts chart, draw `selection` as a `<ReferenceArea>`, and pass
 * `domain` to the `<XAxis>`. Mouse only, so touch scrolling keeps working.
 */
export function useZoomSelection() {
  const [domain, setDomain] = useState<ZoomDomain | null>(null);
  const [start, setStart] = useState<number>();
  const [end, setEnd] = useState<number>();

  const clear = () => {
    setStart(undefined);
    setEnd(undefined);
  };

  const handlers = {
    onMouseDown: (state: MouseHandlerDataParam) => {
      const value = toValue(state);
      if (value === undefined) return;
      setStart(value);
      setEnd(value);
    },
    onMouseMove: (state: MouseHandlerDataParam) => {
      const value = toValue(state);
      if (start !== undefined && value !== undefined) setEnd(value);
    },
    onMouseUp: () => {
      if (start !== undefined && end !== undefined && start !== end) {
        setDomain([Math.min(start, end), Math.max(start, end)]);
      }
      clear();
    },
    onMouseLeave: clear,
  };

  const selection =
    start !== undefined && end !== undefined && start !== end
      ? { x1: Math.min(start, end), x2: Math.max(start, end) }
      : null;

  return {
    domain,
    isZoomed: domain !== null,
    selection,
    handlers,
    reset: () => {
      setDomain(null);
      clear();
    },
  };
}
