"use client";

import { useEffect, useState } from "react";

import { usePreferences } from "@/providers/preferences-provider";

/** Resolves the Preferences theme (including `system`) to a boolean the map style can follow. */
export function useDarkMode() {
  const { values } = usePreferences();
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemDark(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return values.themeMode === "dark" || (values.themeMode === "system" && systemDark);
}
