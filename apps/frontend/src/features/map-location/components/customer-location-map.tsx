"use client";

import { useEffect, useRef, useState } from "react";
import type { FeatureCollection, Point } from "geojson";
import {
  LngLatBounds,
  Map as MapLibre,
  NavigationControl,
  Popup,
  type GeoJSONSource,
  type MapMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@/components/map/maplibre-theme.css";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  BASEMAP_LABELS,
  BASEMAP_STYLES,
  DARK_BASEMAPS,
  type BasemapStyle,
} from "@/lib/maplibre";
import { cn } from "@/lib/utils";
import type { LocationCustomer, MapOverlays } from "../types/map-location";
import { googleMapsUrl, hasCoordinates } from "../utils/map-location";

/** Geographic centre of Indonesia — the source page's default view. */
const INDONESIA: [number, number] = [118.0149, -2.5489];

type CustomerLocationMapProps = {
  data: LocationCustomer[];
  basemap: BasemapStyle;
  overlays: MapOverlays;
  onBasemapChange: (basemap: BasemapStyle) => void;
  onOverlaysChange: (overlays: MapOverlays) => void;
  /** Fired by the popup's "View Details" button with the customer key. */
  onSelectCustomer: (customerId: string) => void;
};

function emptyCollection(): FeatureCollection<Point> {
  return { type: "FeatureCollection", features: [] };
}

/** Cluster tints ramp green → amber → orange as the count grows (<10, <100, ≥100). */
function ensureOverlays(map: MapLibre) {
  if (map.getSource("customers")) return;
  map.addSource("customers", {
    type: "geojson",
    data: emptyCollection(),
    cluster: true,
    clusterRadius: 50,
    clusterMaxZoom: 15,
  });
  map.addSource("customers-heat", { type: "geojson", data: emptyCollection() });
  map.addLayer({
    id: "customers-heat",
    type: "heatmap",
    source: "customers-heat",
    maxzoom: 17,
    paint: {
      "heatmap-weight": 1,
      "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 9, 0.6, 15, 1.6],
      "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 9, 14, 15, 32],
      "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 15, 0.8, 17, 0],
      "heatmap-color": [
        "interpolate", ["linear"], ["heatmap-density"],
        0, "rgba(59,130,246,0)",
        0.2, "rgba(59,130,246,0.45)",
        0.45, "rgba(16,185,129,0.65)",
        0.7, "rgba(245,158,11,0.8)",
        1, "rgba(239,68,68,0.9)",
      ],
    },
  });
  map.addLayer({
    id: "clusters-halo",
    type: "circle",
    source: "customers",
    filter: ["has", "point_count"],
    paint: {
      "circle-radius": ["step", ["get", "point_count"], 22, 10, 26, 100, 32],
      "circle-color": ["step", ["get", "point_count"], "#86efac", 10, "#fde68a", 100, "#fdba74"],
      "circle-opacity": 0.4,
    },
  });
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "customers",
    filter: ["has", "point_count"],
    paint: {
      "circle-radius": ["step", ["get", "point_count"], 16, 10, 20, 100, 26],
      "circle-color": ["step", ["get", "point_count"], "#86efac", 10, "#fde68a", 100, "#fdba74"],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-opacity": 0.9,
    },
  });
  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "customers",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-font": ["Noto Sans Bold"],
      "text-size": 12,
    },
    paint: { "text-color": "#1f2937" },
  });
  // Soft halo in the pin's own colour lifts it off the basemap without a hard edge.
  map.addLayer({
    id: "customer-pin-ring",
    type: "circle",
    source: "customers",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-radius": 12,
      "circle-color": "#2563eb",
      "circle-opacity": 0.28,
      "circle-blur": 0.4,
    },
  });
  map.addLayer({
    id: "customer-pin",
    type: "circle",
    source: "customers",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-radius": 7,
      "circle-color": "#2563eb",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] ?? char);
}

/**
 * Popup body as a real DOM node so "View Details" can call straight back into
 * React instead of going through a global handler.
 */
function createPopupElement(customer: LocationCustomer, onViewDetails: () => void) {
  const element = document.createElement("div");
  element.className = "min-w-[17rem] p-1 text-[0.8125rem]";
  const field = (label: string, value: string, span = false) => `
    <div${span ? ' class="col-span-2"' : ""}>
      <span class="block text-[0.6875rem] text-muted-foreground">${label}</span>
      <span class="font-medium text-foreground">${escapeHtml(value || "N/A")}</span>
    </div>`;
  element.innerHTML = `
    <div class="mb-2">
      <h5 class="m-0 text-sm font-semibold text-foreground">${escapeHtml(customer.name)}</h5>
      <p class="mt-0.5 mb-0 text-xs text-muted-foreground">📍 ${escapeHtml(customer.street.name)}</p>
    </div>
    <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-2">
      ${field("Branch", customer.branch.name)}
      ${field("Employee", customer.employee.name)}
      ${field("Category", customer.category.name)}
      ${field("City", customer.city.name)}
      ${field("District", customer.district.name, true)}
    </div>
    <div class="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
      <button type="button" data-action="details"
        class="inline-flex h-7 items-center justify-center rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
        View Details
      </button>
      <button type="button" data-action="maps"
        class="inline-flex h-7 items-center justify-center rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground hover:bg-muted">
        View Maps
      </button>
    </div>`;
  element.querySelector('[data-action="details"]')?.addEventListener("click", onViewDetails);
  element.querySelector('[data-action="maps"]')?.addEventListener("click", () => {
    if (hasCoordinates(customer)) {
      window.open(googleMapsUrl(customer.latitude, customer.longitude), "_blank", "noopener");
    }
  });
  return element;
}

export function CustomerLocationMap({
  data,
  basemap,
  overlays,
  onBasemapChange,
  onOverlaysChange,
  onSelectCustomer,
}: CustomerLocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibre | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const dataRef = useRef(data);
  const onSelectRef = useRef(onSelectCustomer);
  // Only a new customer set re-fits the view; basemap and overlay changes keep the camera.
  const fitPending = useRef(true);
  const [styleVersion, setStyleVersion] = useState(0);
  useEffect(() => {
    dataRef.current = data;
    onSelectRef.current = onSelectCustomer;
  }, [data, onSelectCustomer]);
  useEffect(() => {
    fitPending.current = true;
  }, [data]);

  // Build the map once; the basemap swaps in place.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const map = new MapLibre({
      container,
      style: BASEMAP_STYLES[basemap],
      center: INDONESIA,
      zoom: 4.6,
      attributionControl: false,
    });
    map.addControl(new NavigationControl({ visualizePitch: false }), "top-left");
    map.on("style.load", () => {
      ensureOverlays(map);
      setStyleVersion((version) => version + 1);
    });
    map.on("click", "clusters", (event: MapMouseEvent) => {
      const feature = map.queryRenderedFeatures(event.point, { layers: ["clusters"] })[0];
      const clusterId = feature?.properties?.cluster_id;
      if (typeof clusterId !== "number") return;
      const source = map.getSource("customers") as GeoJSONSource;
      void source.getClusterExpansionZoom(clusterId).then((zoom) => {
        map.easeTo({ center: (feature!.geometry as Point).coordinates as [number, number], zoom });
      });
    });
    map.on("click", "customer-pin", (event: MapMouseEvent) => {
      const feature = map.queryRenderedFeatures(event.point, { layers: ["customer-pin"] })[0];
      const key = feature?.properties?.key;
      const customer = dataRef.current.find((item) => item.key === key);
      if (!customer || !hasCoordinates(customer)) return;
      popupRef.current?.remove();
      popupRef.current = new Popup({ offset: 12, maxWidth: "24rem" })
        .setLngLat([customer.longitude, customer.latitude])
        .setDOMContent(createPopupElement(customer, () => onSelectRef.current(customer.key)))
        .addTo(map);
    });
    for (const layer of ["clusters", "customer-pin"]) {
      map.on("mouseenter", layer, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", layer, () => { map.getCanvas().style.cursor = ""; });
    }
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // The map is created once; basemap and data are applied by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    map.setStyle(BASEMAP_STYLES[basemap]);
  }, [basemap]);

  // Push the customer set into both sources and fit the view onto it.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleVersion === 0) return;
    const cluster = map.getSource("customers") as GeoJSONSource | undefined;
    const heat = map.getSource("customers-heat") as GeoJSONSource | undefined;
    if (!cluster || !heat) return;
    const plotted = data.filter(hasCoordinates);
    const collection: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: plotted.map((customer) => ({
        type: "Feature",
        properties: { key: customer.key },
        geometry: { type: "Point", coordinates: [customer.longitude, customer.latitude] },
      })),
    };
    cluster.setData(overlays.location ? collection : emptyCollection());
    heat.setData(overlays.heat ? collection : emptyCollection());
    if (!fitPending.current) return;
    fitPending.current = false;
    popupRef.current?.remove();
    if (plotted.length) {
      const bounds = plotted.reduce(
        (acc, customer) => acc.extend([customer.longitude, customer.latitude]),
        new LngLatBounds(
          [plotted[0]!.longitude, plotted[0]!.latitude],
          [plotted[0]!.longitude, plotted[0]!.latitude],
        ),
      );
      map.stop();
      map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 700 });
    }
  }, [data, overlays, styleVersion]);

  const dark = DARK_BASEMAPS.has(basemap);

  return (
    <div className={cn("maplibre-theme relative size-full bg-muted", dark && "maplibre-theme-dark")}>
      <div ref={containerRef} className="size-full" role="application" aria-label="Customer location map" />

      {/* Layers control, like the source page's always-open Leaflet control. */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 rounded-md border border-border bg-popover/95 p-2.5 text-xs text-popover-foreground shadow-sm backdrop-blur-sm">
        <RadioGroup
          value={basemap}
          onValueChange={(value) => onBasemapChange(value as BasemapStyle)}
          aria-label="Basemap"
          className="gap-1.5"
        >
          {(Object.keys(BASEMAP_LABELS) as BasemapStyle[]).map((style) => (
            <Label key={style} className="flex items-center gap-2 text-xs font-normal">
              <RadioGroupItem value={style} /> {BASEMAP_LABELS[style]}
            </Label>
          ))}
        </RadioGroup>
        <div className="border-t border-border" />
        <Label className="flex items-center gap-2 text-xs font-normal">
          <Checkbox
            checked={overlays.location}
            onCheckedChange={(checked) => onOverlaysChange({ ...overlays, location: checked === true })}
          />
          Location
        </Label>
        <Label className="flex items-center gap-2 text-xs font-normal">
          <Checkbox
            checked={overlays.heat}
            onCheckedChange={(checked) => onOverlaysChange({ ...overlays, heat: checked === true })}
          />
          Heat
        </Label>
      </div>

      <div className="absolute right-2 bottom-2 z-10 rounded-md bg-background/85 px-2 py-1 text-[0.6875rem] leading-tight text-muted-foreground shadow-sm backdrop-blur-sm">
        <a href="https://openfreemap.org" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">OpenFreeMap</a>{" "}
        ©{" "}
        <a href="https://openmaptiles.org" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">OpenMapTiles</a>{" "}
        Data from{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">OpenStreetMap</a>
      </div>
    </div>
  );
}
