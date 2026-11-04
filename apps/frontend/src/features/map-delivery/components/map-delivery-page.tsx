"use client";

import { useCallback, useRef, useState } from "react";
import {
  LayersIcon,
  MapPinPlusIcon,
  RadioIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useDarkMode } from "../hooks/use-dark-mode";
import { useFleet } from "../hooks/use-fleet";
import type {
  FleetException,
  LngLat,
  MapBasemap,
  MapLayers,
  Stop,
  Van,
} from "../types/map-delivery";
import { formatClock, nextStop, vanColor } from "../utils/map-delivery";
import { ExceptionsTimeline, type ExceptionFix } from "./exceptions-timeline";
import { FleetCommand, type FleetCommandTarget } from "./fleet-command";
import { FleetMap } from "./fleet-map";

const basemapLabels: Record<MapBasemap, string> = {
  auto: "Auto (follow theme)",
  bright: "Bright",
  positron: "Positron",
  dark: "Dark",
  fiord: "Fiord",
};
import { FleetOverviewPanel } from "./fleet-overview-panel";
import { NewDeliveryDialog } from "./new-delivery-dialog";
import { FailStopSheet, ReassignDialog, RescheduleDialog } from "./stop-dialogs";
import { VanDetailPanel, type StopAction } from "./van-detail-panel";
import { VanDialog, type VanDialogState } from "./van-dialog";
import { VanGrid, type VanGridAction } from "./van-grid";
import type { VanMarkerAction } from "./van-marker";
import { VanSheet } from "./van-sheet";

export function MapDeliveryPage() {
  const [live, setLive] = useState(true);
  const { state, dispatch, canRetire } = useFleet({ live });
  const dark = useDarkMode();
  const mapSectionRef = useRef<HTMLDivElement>(null);

  const [selectedVanId, setSelectedVanId] = useState<string | null>(null);
  const [follow, setFollow] = useState(false);
  const [layers, setLayers] = useState<MapLayers>({ routes: true, stops: true, labels: true });
  const [basemap, setBasemap] = useState<MapBasemap>("auto");
  const resolvedBasemap = basemap === "auto" ? (dark ? "dark" : "positron") : basemap;
  const [placing, setPlacing] = useState(false);
  const [placeAt, setPlaceAt] = useState<LngLat | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [sheetVanId, setSheetVanId] = useState<string | null>(null);
  const [failStop, setFailStop] = useState<Stop | null>(null);
  const [rescheduleStop, setRescheduleStop] = useState<Stop | null>(null);
  const [reassignStop, setReassignStop] = useState<Stop | null>(null);
  const [vanDialog, setVanDialog] = useState<VanDialogState>(null);

  const selectedVan = state.vans.find((van) => van.id === selectedVanId && van.status !== "retired") ?? null;
  const sheetVan = state.vans.find((van) => van.id === sheetVanId) ?? null;
  const colorOf = (van: Van) => vanColor(state.vans.indexOf(van));

  const selectVan = useCallback((vanId: string | null) => {
    setSelectedVanId(vanId);
    if (!vanId) setFollow(false);
  }, []);

  const showOnMap = (vanId: string) => {
    selectVan(vanId);
    mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onMarkerAction = (action: VanMarkerAction, vanId: string) => {
    if (action === "open") selectVan(vanId);
    if (action === "details") setSheetVanId(vanId);
    if (action === "follow") {
      selectVan(vanId);
      setFollow(true);
    }
    if (action === "message") dispatch({ type: "message-driver", vanId });
  };

  const onStopAction = (action: StopAction, stop: Stop) => {
    if (action === "deliver") dispatch({ type: "deliver", stopId: stop.id });
    if (action === "fail") setFailStop(stop);
    if (action === "reschedule") setRescheduleStop(stop);
    if (action === "reassign") setReassignStop(stop);
  };

  const onExceptionFix = (fix: ExceptionFix, exception: FleetException) => {
    const stop =
      (exception.stopId && state.stops.find((item) => item.id === exception.stopId)) ||
      nextStop(state.stops, exception.vanId);
    if (fix === "message") {
      dispatch({ type: "message-driver", vanId: exception.vanId });
      dispatch({ type: "acknowledge", exceptionId: exception.id });
      return;
    }
    if (!stop) return;
    selectVan(exception.vanId);
    if (fix === "reassign") setReassignStop(stop);
    if (fix === "reschedule") setRescheduleStop(stop);
  };

  const onCommand = (target: FleetCommandTarget) => {
    if (target.type === "van") showOnMap(target.vanId);
    if (target.type === "stop") {
      const stop = state.stops.find((item) => item.id === target.stopId);
      if (stop) showOnMap(stop.vanId);
    }
    if (target.type === "area") {
      const van = state.vans.find((item) => item.areaId === target.areaId && item.status !== "retired");
      if (van) showOnMap(van.id);
    }
  };

  const onGridAction = (action: VanGridAction, van: Van) => {
    if (action === "view") showOnMap(van.id);
    if (action === "sheet") setSheetVanId(van.id);
    if (action === "edit") setVanDialog({ type: "edit", van });
    if (action === "retire") setVanDialog({ type: "retire", van });
  };

  const panel = selectedVan ? (
    <VanDetailPanel
      state={state}
      van={selectedVan}
      follow={follow}
      onBack={() => selectVan(null)}
      onToggleFollow={() => setFollow((current) => !current)}
      onOpenSheet={() => setSheetVanId(selectedVan.id)}
      onStopAction={onStopAction}
    />
  ) : (
    <FleetOverviewPanel state={state} />
  );

  return (
    <AppBody>
      <PageHeading
        title="Map Delivery"
        currentPage="Map Delivery"
        description={
          <>
            Heron Run · Jakarta same-day fleet · <span className="tabular-nums">{formatClock(state.now)}</span>
          </>
        }
      >
        <Button variant="outline" size="sm" onClick={() => setCommandOpen(true)}>
          <SearchIcon /> Search
          <Kbd className="ml-1 border px-1.5 text-[10px]">⌘K</Kbd>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <LayersIcon /> Layers
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuRadioGroup
              value={basemap}
              onValueChange={(value) => setBasemap(value as MapBasemap)}
            >
              <DropdownMenuLabel>Basemap</DropdownMenuLabel>
              {(Object.keys(basemapLabels) as MapBasemap[]).map((key) => (
                <DropdownMenuRadioItem key={key} value={key}>
                  {basemapLabels[key]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Overlays</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={layers.routes} onCheckedChange={(routes) => setLayers((current) => ({ ...current, routes }))}>
                Route lines
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={layers.stops} onCheckedChange={(stops) => setLayers((current) => ({ ...current, stops }))}>
                Stop dots
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={layers.labels} onCheckedChange={(labels) => setLayers((current) => ({ ...current, labels }))}>
                Van labels
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant={live ? "secondary" : "outline"}
          size="sm"
          aria-pressed={live}
          onClick={() => setLive((current) => !current)}
        >
          <RadioIcon className={cn(live && "text-emerald-500")} /> {live ? "Live" : "Paused"}
        </Button>
        <Button
          size="sm"
          variant={placing ? "destructive" : "default"}
          aria-pressed={placing}
          onClick={() => setPlacing((current) => !current)}
        >
          {placing ? <XIcon /> : <MapPinPlusIcon />} {placing ? "Cancel" : "New delivery"}
        </Button>
      </PageHeading>

      <section ref={mapSectionRef} className="relative scroll-mt-4">
        <div className="h-[28rem] md:h-[min(42rem,calc(100vh-13rem))]">
          <FleetMap
            state={state}
            basemap={resolvedBasemap}
            layers={layers}
            selectedVanId={selectedVan?.id ?? null}
            follow={follow}
            placing={placing}
            onSelectVan={selectVan}
            onPlace={(position) => {
              setPlacing(false);
              setPlaceAt(position);
            }}
            onVanAction={onMarkerAction}
          />
        </div>
        <Card
          size="sm"
          className="mt-3 md:absolute md:top-3 md:right-3 md:z-20 md:mt-0 md:max-h-[calc(100%-1.5rem)] md:w-[22rem] md:overflow-y-auto md:bg-card/95 md:shadow-lg md:backdrop-blur-sm"
        >
          <CardContent>{panel}</CardContent>
        </Card>
      </section>

      <Tabs defaultValue="vans">
        <TabsList>
          <TabsTrigger value="vans">Vans</TabsTrigger>
          <TabsTrigger value="exceptions">
            Exceptions
            <span className="rounded-full bg-muted px-1.5 text-[0.625rem] tabular-nums">
              {state.exceptions.filter((item) => !item.acknowledged).length}
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="vans">
          <Card>
            <CardContent>
              <VanGrid state={state} onAdd={() => setVanDialog({ type: "add" })} onAction={onGridAction} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="exceptions">
          <Card>
            <CardContent>
              <ExceptionsTimeline
                state={state}
                onView={(exception) => showOnMap(exception.vanId)}
                onAcknowledge={(exception) => dispatch({ type: "acknowledge", exceptionId: exception.id })}
                onFix={onExceptionFix}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FleetCommand state={state} open={commandOpen} onOpenChange={setCommandOpen} onSelect={onCommand} />
      <VanSheet
        state={state}
        van={sheetVan}
        color={sheetVan ? colorOf(sheetVan) : vanColor(0)}
        onClose={() => setSheetVanId(null)}
        onSaveControls={(vanId, controls) => dispatch({ type: "controls", vanId, controls })}
      />
      <FailStopSheet
        stop={failStop}
        onClose={() => setFailStop(null)}
        onSubmit={(reason, note) => {
          if (failStop) dispatch({ type: "fail", stopId: failStop.id, reason, note });
          setFailStop(null);
        }}
      />
      {rescheduleStop && (
        <RescheduleDialog
          key={rescheduleStop.id}
          stop={rescheduleStop}
          onClose={() => setRescheduleStop(null)}
          onSubmit={(window) => {
            dispatch({ type: "reschedule", stopId: rescheduleStop.id, window });
            setRescheduleStop(null);
          }}
        />
      )}
      {reassignStop && (
        <ReassignDialog
          key={reassignStop.id}
          state={state}
          stop={reassignStop}
          onClose={() => setReassignStop(null)}
          onSubmit={(vanId) => {
            dispatch({ type: "reassign", stopId: reassignStop.id, vanId });
            setReassignStop(null);
          }}
        />
      )}
      {placeAt && (
        <NewDeliveryDialog
          state={state}
          position={placeAt}
          onClose={() => setPlaceAt(null)}
          onSubmit={(draft) => {
            dispatch({ type: "add-delivery", draft });
            setPlaceAt(null);
            showOnMap(draft.vanId);
          }}
        />
      )}
      <VanDialog
        state={state}
        dialog={vanDialog}
        canRetire={vanDialog?.type === "retire" ? canRetire(vanDialog.van.id) : false}
        onClose={() => setVanDialog(null)}
        onSave={(draft, vanId) => {
          dispatch(vanId ? { type: "edit-van", vanId, draft } : { type: "add-van", draft });
          setVanDialog(null);
        }}
        onRetire={(vanId) => {
          dispatch({ type: "retire-van", vanId });
          if (selectedVanId === vanId) selectVan(null);
          setVanDialog(null);
        }}
      />
    </AppBody>
  );
}
