"use client";

import { useEffect, useState } from "react";

import { salesIncomingOrders, salesRecentOrders } from "@/mocks/dashboard-sales.mock";

import type { SalesFeedOrder } from "../types/sales";

const TICK_MS = 8_000;
const FEED_SIZE = 8;

type LiveState = {
  clock: number;
  feed: SalesFeedOrder[];
  next: number;
  extraRevenue: number;
  extraOrders: number;
  latestId: string | null;
};

function initialState(now: number): LiveState {
  return {
    clock: now,
    feed: salesRecentOrders.map(({ minutesAgo, ...order }) => ({
      ...order,
      at: now - minutesAgo * 60_000,
    })),
    next: 0,
    extraRevenue: 0,
    extraOrders: 0,
    latestId: null,
  };
}

/**
 * Simulates a live order stream on top of the sample data. Every tick adds
 * one order to the feed and to today's totals until the viewer pauses it.
 */
export function useSalesLive(now: number) {
  const [state, setState] = useState(() => initialState(now));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setState((current) => {
        const seed = salesIncomingOrders[current.next % salesIncomingOrders.length]!;
        const id = String(14551 + current.next);
        const clock = Date.now();
        return {
          clock,
          feed: [{ ...seed, id, at: clock }, ...current.feed].slice(0, FEED_SIZE),
          next: current.next + 1,
          extraRevenue: current.extraRevenue + seed.total,
          extraOrders: current.extraOrders + 1,
          latestId: id,
        };
      });
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  return { ...state, paused, setPaused };
}
