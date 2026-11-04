import { setWorkerUrl } from "maplibre-gl";

// MapLibre resolves its worker relative to its own module URL, which the
// bundler does not emit. Point it at the worker as a static asset instead.
setWorkerUrl(
  new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href,
);

/** OpenFreeMap vector styles (OpenMapTiles schema, OpenStreetMap data). */
export type BasemapStyle = "bright" | "positron" | "dark" | "fiord";

export const BASEMAP_STYLES: Record<BasemapStyle, string> = {
  bright: "https://tiles.openfreemap.org/styles/bright",
  positron: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
  fiord: "https://tiles.openfreemap.org/styles/fiord",
};

export const BASEMAP_LABELS: Record<BasemapStyle, string> = {
  bright: "Bright",
  positron: "Positron",
  dark: "Dark",
  fiord: "Fiord",
};

/** Styles with a dark canvas; map chrome (controls, popups) should follow them. */
export const DARK_BASEMAPS: ReadonlySet<BasemapStyle> = new Set(["dark", "fiord"]);

/** The basemap that matches the app theme. */
export function themeBasemap(dark: boolean): BasemapStyle {
  return dark ? "dark" : "positron";
}
