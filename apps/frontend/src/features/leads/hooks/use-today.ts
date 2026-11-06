"use client";

import { useEffect, useState } from "react";
import { todayDate } from "../utils/leads";

/** Today's `yyyy-MM-dd`, empty during SSR so server and client markup match. */
export function useToday() {
  const [today, setToday] = useState("");
  useEffect(() => {
    const update = () => setToday(todayDate());
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 60_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);
  return today;
}
