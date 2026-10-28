"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export type LivePoint = { tick: number; time: string; value: number };

const MIN = 20;
const MAX = 80;

// Integer hash → 0..20. Deterministic, so server and client render the same
// initial data (no Math.random or Date.now during render).
function step(tick: number) {
  let x = Math.imul(tick + 1, 0x9e3779b1);
  x ^= x >>> 15;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  return ((x >>> 0) % 21) - 10;
}

function formatTick(tick: number) {
  const seconds = Math.floor(tick * 1.5);
  const mm = String(Math.floor(seconds / 60) % 60).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function nextPoint(previous: LivePoint): LivePoint {
  const tick = previous.tick + 1;
  const value = Math.min(MAX, Math.max(MIN, previous.value + step(tick)));
  return { tick, time: formatTick(tick), value };
}

function createSeries(size: number) {
  const points: LivePoint[] = [{ tick: 0, time: formatTick(0), value: 50 }];
  while (points.length < size)
    points.push(nextPoint(points[points.length - 1]!));
  return points;
}

const reducedMotion = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(reducedMotion);
  media.addEventListener("change", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

function canRun() {
  return !document.hidden && !window.matchMedia(reducedMotion).matches;
}

/**
 * Live time series: appends a pseudo-random point every `intervalMs` and
 * keeps the last `size` points. Pauses while the tab is hidden or the user
 * prefers reduced motion.
 */
export function useLiveSeries({ size = 30, intervalMs = 1500 } = {}) {
  const [points, setPoints] = useState(() => createSeries(size));
  const isLive = useSyncExternalStore(subscribe, canRun, () => false);

  useEffect(() => {
    if (!isLive) return;
    const id = window.setInterval(() => {
      setPoints((current) => {
        const last = current[current.length - 1];
        return last ? [...current, nextPoint(last)].slice(-size) : current;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [isLive, intervalMs, size]);

  return { points, isLive };
}
