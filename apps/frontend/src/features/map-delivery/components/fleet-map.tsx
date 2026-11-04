"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FeatureCollection } from "geojson";
import {
  Map as MapLibre,
  Marker,
  NavigationControl,
  Popup,
  type GeoJSONSource,
  type MapMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { WarehouseIcon } from "lucide-react";

import {
  BASEMAP_STYLES as STYLES,
  DARK_BASEMAPS,
  type BasemapStyle,
} from "@/lib/maplibre";
import { cn } from "@/lib/utils";
import type { FleetState, LngLat, MapLayers, Van } from "../types/map-delivery";
import { isAtRisk, routePath, vanColor, worstException } from "../utils/map-delivery";
import { VanMarker, type VanMarkerAction } from "./van-marker";
import "@/components/map/maplibre-theme.css";

const JAKARTA: LngLat = [106.8455, -6.2125];

type FleetMapProps = {
  state: FleetState;
  basemap: BasemapStyle;
  layers: MapLayers;
  selectedVanId: string | null;
  follow: boolean;
  /** When set, the next map click places a new delivery instead of selecting. */
  placing: boolean;
  onSelectVan: (vanId: string | null) => void;
  onPlace: (position: LngLat) => void;
  onVanAction: (action: VanMarkerAction, vanId: string) => void;
};

function ensureOverlays(map: MapLibre) {
  if (map.getSource("routes")) return;
  map.addSource("routes", { type: "geojson", data: emptyCollection() });
  map.addSource("stops", { type: "geojson", data: emptyCollection() });
  map.addLayer({
    id: "routes-line",
    type: "line",
    source: "routes",
    layout: { "line-join": "round", "line-cap": "round" },
    paint: {
      "line-color": ["get", "color"],
      "line-width": ["case", ["get", "selected"], 4, 2.5],
      "line-opacity": ["case", ["get", "dimmed"], 0.25, 0.85],
      "line-dasharray": [1, 1.5],
    },
  });
  map.addLayer({
    id: "stops-halo",
    type: "circle",
    source: "stops",
    filter: ["==", ["get", "atRisk"], true],
    paint: {
      "circle-radius": 11,
      "circle-color": "#f97316",
      "circle-opacity": 0.25,
    },
  });
  // Soft halo in the dot's own colour lifts it off the basemap without a hard edge.
  map.addLayer({
    id: "stops-ring",
    type: "circle",
    source: "stops",
    paint: {
      "circle-radius": ["case", ["get", "selected"], 11, 9],
      "circle-color": ["case", ["get", "failed"], "#ef4444", ["get", "color"]],
      "circle-opacity": ["case", ["get", "done"], 0.15, 0.3],
      "circle-blur": 0.4,
    },
  });
  map.addLayer({
    id: "stops-dot",
    type: "circle",
    source: "stops",
    paint: {
      "circle-radius": ["case", ["get", "selected"], 6, 4.5],
      "circle-color": ["get", "color"],
      "circle-opacity": ["case", ["get", "done"], 0.35, 1],
      "circle-stroke-width": 1.5,
      "circle-stroke-color": "#ffffff",
      "circle-stroke-opacity": ["case", ["get", "done"], 0.35, 1],
    },
  });
}

function emptyCollection(): FeatureCollection {
  return { type: "FeatureCollection", features: [] };
}

export function FleetMap({
  state,
  basemap,
  layers,
  selectedVanId,
  follow,
  placing,
  onSelectVan,
  onPlace,
  onVanAction,
}: FleetMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibre | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const depotRef = useRef<Marker | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const [styleVersion, setStyleVersion] = useState(0);
  const [markerHosts, setMarkerHosts] = useState<Record<string, HTMLDivElement>>({});
  // Map event handlers are bound once, so they read the latest props through refs.
  const placingRef = useRef(placing);
  const onPlaceRef = useRef(onPlace);
  const onSelectRef = useRef(onSelectVan);
  useEffect(() => {
    placingRef.current = placing;
    onPlaceRef.current = onPlace;
    onSelectRef.current = onSelectVan;
  }, [placing, onPlace, onSelectVan]);

  // Create the map once; the style swaps in place when the theme changes.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const markers = markersRef.current;
    const map = new MapLibre({
      container,
      style: STYLES[basemap],
      center: JAKARTA,
      zoom: 11.4,
      attributionControl: false,
    });
    map.addControl(new NavigationControl({ visualizePitch: false }), "top-left");
    map.on("style.load", () => {
      ensureOverlays(map);
      setStyleVersion((version) => version + 1);
    });
    map.on("click", (event: MapMouseEvent) => {
      if (placingRef.current) {
        onPlaceRef.current([event.lngLat.lng, event.lngLat.lat]);
        return;
      }
      const hits = map.queryRenderedFeatures(event.point, { layers: ["stops-dot"] });
      const stop = hits[0]?.properties;
      if (stop && typeof stop.vanId === "string") {
        onSelectRef.current(stop.vanId);
        popupRef.current?.remove();
        popupRef.current = new Popup({ closeButton: false, offset: 10 })
          .setLngLat(event.lngLat)
          .setHTML(
            `<strong>${escapeHtml(String(stop.recipient))}</strong><br/>${escapeHtml(String(stop.detail))}`,
          )
          .addTo(map);
        return;
      }
      popupRef.current?.remove();
      onSelectRef.current(null);
    });
    map.on("mousemove", (event: MapMouseEvent) => {
      const hovering = map.queryRenderedFeatures(event.point, { layers: ["stops-dot"] }).length > 0;
      map.getCanvas().style.cursor = placingRef.current ? "crosshair" : hovering ? "pointer" : "";
    });
    const depotHost = document.createElement("div");
    depotRef.current = new Marker({ element: depotHost }).setLngLat(state.depot).addTo(map);
    setMarkerHosts((hosts) => ({ ...hosts, depot: depotHost }));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
    };
    // The map is created once; basemap and data are applied by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    map.setStyle(STYLES[basemap]);
  }, [basemap]);

  const dark = DARK_BASEMAPS.has(basemap);

  useEffect(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = placing ? "crosshair" : "";
  }, [placing]);

  // One marker per active van; hosts are React portals so the marker UI stays declarative.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const markers = markersRef.current;
    const active = state.vans.filter((van) => van.status !== "retired");
    let changed = false;
    const hosts: Record<string, HTMLDivElement> = {};
    for (const van of active) {
      let marker = markers.get(van.id);
      if (!marker) {
        const host = document.createElement("div");
        marker = new Marker({ element: host, anchor: "center" })
          .setLngLat(van.position)
          .addTo(map);
        markers.set(van.id, marker);
        changed = true;
      } else {
        marker.setLngLat(van.position);
      }
      hosts[van.id] = marker.getElement() as HTMLDivElement;
    }
    for (const [vanId, marker] of markers) {
      if (!active.some((van) => van.id === vanId)) {
        marker.remove();
        markers.delete(vanId);
        changed = true;
      }
    }
    if (changed) {
      setMarkerHosts((current) => ({ ...hosts, depot: current.depot! }));
    }
  }, [state.vans]);

  // Keep the selected marker above its neighbours.
  useEffect(() => {
    for (const [vanId, marker] of markersRef.current) {
      marker.getElement().style.zIndex = vanId === selectedVanId ? "2" : "1";
    }
  }, [selectedVanId, markerHosts]);

  // Routes and stops as GeoJSON; rebuilt whenever data, selection or layer toggles change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || styleVersion === 0) return;
    const routes = map.getSource("routes") as GeoJSONSource | undefined;
    const stops = map.getSource("stops") as GeoJSONSource | undefined;
    if (!routes || !stops) return;
    const active = state.vans.filter((van) => van.status !== "retired");
    const colorOf = new Map(state.vans.map((van, index) => [van.id, vanColor(index)]));
    routes.setData({
      type: "FeatureCollection",
      features: layers.routes
        ? active
            .filter((van) => ["en-route", "returning", "loading", "breakdown"].includes(van.status))
            .map((van) => ({
              type: "Feature",
              properties: {
                color: colorOf.get(van.id),
                selected: van.id === selectedVanId,
                dimmed: selectedVanId !== null && van.id !== selectedVanId,
              },
              geometry: { type: "LineString", coordinates: routePath(van, state.stops, state.depot) },
            }))
        : [],
    });
    stops.setData({
      type: "FeatureCollection",
      features: layers.stops
        ? state.stops
            .filter((stop) => active.some((van) => van.id === stop.vanId))
            .map((stop) => ({
              type: "Feature",
              properties: {
                vanId: stop.vanId,
                recipient: stop.recipient,
                detail: `${stop.address} · ETA ${stop.eta} · ${stop.status}`,
                color: colorOf.get(stop.vanId),
                selected: stop.vanId === selectedVanId,
                done: stop.status !== "to-go",
                failed: stop.status === "failed",
                atRisk: isAtRisk(stop),
              },
              geometry: { type: "Point", coordinates: stop.position },
            }))
        : [],
    });
  }, [state, layers, selectedVanId, styleVersion]);

  // Follow the selected van as it moves.
  const selected = state.vans.find((van) => van.id === selectedVanId);
  const selectedLng = selected?.position[0];
  const selectedLat = selected?.position[1];
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !follow || selectedLng === undefined || selectedLat === undefined) return;
    map.easeTo({ center: [selectedLng, selectedLat], zoom: Math.max(map.getZoom(), 13), duration: 900 });
  }, [follow, selectedLng, selectedLat]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || follow || !selected) return;
    map.easeTo({ center: selected.position, duration: 600 });
    // Only recentre when the selection changes, not on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVanId]);

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl bg-muted",
        "maplibre-theme",
        dark && "maplibre-theme-dark",
      )}
    >
      <div ref={containerRef} className="h-full w-full" aria-label="Fleet map" role="application" />
      {markerHosts.depot &&
        createPortal(
          <div
            className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background shadow-md ring-2 ring-background"
            title="Heron Run depot"
          >
            <WarehouseIcon className="size-4" />
          </div>,
          markerHosts.depot,
        )}
      {state.vans
        .filter((van): van is Van => van.status !== "retired" && !!markerHosts[van.id])
        .map((van, index) => (
          createPortal(
            <VanMarker
              key={van.id}
              van={van}
              color={vanColor(state.vans.indexOf(van))}
              driver={state.drivers.find((driver) => driver.id === van.driverId)?.name ?? ""}
              exception={worstException(state.exceptions, van.id)}
              selected={van.id === selectedVanId}
              showLabel={layers.labels}
              onSelect={() => onSelectVan(van.id)}
              onAction={(action) => onVanAction(action, van.id)}
              tabIndex={index === 0 ? 0 : -1}
            />,
            markerHosts[van.id]!,
            van.id,
          )
        ))}
      <div className="pointer-events-auto absolute right-2 bottom-2 z-10 rounded-md bg-background/85 px-2 py-1 text-[0.6875rem] leading-tight text-muted-foreground shadow-sm backdrop-blur-sm">
        ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
          OpenStreetMap
        </a>{" "}
        contributors ·{" "}
        <a href="https://openfreemap.org" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
          OpenFreeMap
        </a>{" "}
        ·{" "}
        <a href="https://openmaptiles.org" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
          © OpenMapTiles
        </a>
      </div>
      {placing && (
        <div className="pointer-events-none absolute inset-x-0 top-2 z-10 flex justify-center">
          <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background shadow">
            Click the map to place the delivery
          </span>
        </div>
      )}
    </div>
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char] ?? char);
}
