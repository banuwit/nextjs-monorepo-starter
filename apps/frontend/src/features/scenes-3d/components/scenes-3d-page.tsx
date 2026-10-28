"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  BoxIcon,
  LocateFixedIcon,
  MapIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toaster, toast } from "@/components/ui/toast";
import { stadiumData } from "@/mocks/stadium.mock";
import { useSceneColors } from "../hooks/use-scene-colors";
import { useWebGLSupport } from "../hooks/use-webgl-support";
import { seatSelectionSchema } from "../schemas/stadium.schema";
import type { RenderMode, SceneView, Sector } from "../types/stadium";
import {
  formatKickoff,
  formatMoney,
  summarizeStadium,
  walkingOrder,
} from "../utils/stadium";
import { PriceTimeline } from "./price-timeline";
import { SeatViewDialog } from "./seat-view-dialog";
import { SelectionPanel } from "./selection-panel";
import { StadiumPlan } from "./stadium-plan";
import { StadiumStats } from "./stadium-stats";

const StadiumCanvas = dynamic(() => import("./stadium-canvas"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-none" />,
});

export function Scenes3DPage() {
  const { fixture, tiers, sectors, dailySales } = stadiumData;
  const colors = useSceneColors();
  const webgl = useWebGLSupport();

  const [view, setView] = useState<SceneView>("3d");
  const [renderMode, setRenderMode] = useState<RenderMode>("demand");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [seats, setSeats] = useState(2);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [resetToken, setResetToken] = useState(0);

  // Totals never change in the demo, so they are derived once per load.
  const totals = useMemo(() => summarizeStadium(stadiumData), []);
  const ordered = useMemo(() => walkingOrder(sectors), [sectors]);
  const selected = sectors.find((sector) => sector.id === selectedId) ?? null;
  const hovered = sectors.find((sector) => sector.id === hoveredId) ?? null;

  const effectiveView: SceneView = webgl === false ? "plan" : view;

  function selectSector(sector: Sector) {
    setSelectedId(sector.id);
    setSeats((current) => Math.max(1, Math.min(current, sector.seatsLeft, 6)));
  }

  function checkout() {
    const result = seatSelectionSchema.safeParse({
      sectorId: selectedId ?? "",
      seats,
    });
    if (!result.success || !selected) {
      toast.add({
        title: "Selection incomplete",
        description: result.success
          ? "Pick a sector first."
          : result.error.issues[0]?.message,
        type: "error",
      });
      return;
    }
    toast.add({
      title: `${seats} seat${seats > 1 ? "s" : ""} held in ${selected.label}`,
      description:
        "Seats are held for 10 minutes in a real flow. This demo holds nothing and charges nothing.",
      type: "success",
    });
  }

  return (
    <AppBody>
      <PageHeading title="3D Scenes" currentPage="3D Scenes">
        <ToggleGroup
          value={[effectiveView]}
          onValueChange={(value) => {
            if (value[0]) setView(value[0] as SceneView);
          }}
          aria-label="Scene view"
          variant="outline"
        >
          <ToggleGroupItem value="3d" disabled={webgl === false} aria-label="3D bowl">
            <BoxIcon />
            3D bowl
          </ToggleGroupItem>
          <ToggleGroupItem value="plan" aria-label="2D plan">
            <MapIcon />
            2D plan
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          value={[renderMode]}
          onValueChange={(value) => {
            if (value[0]) setRenderMode(value[0] as RenderMode);
          }}
          aria-label="Render mode"
          variant="outline"
        >
          <ToggleGroupItem value="demand">On demand</ToggleGroupItem>
          <ToggleGroupItem value="always">Per frame</ToggleGroupItem>
        </ToggleGroup>
      </PageHeading>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <Card className="gap-0 overflow-hidden py-0">
            <CardHeader className="flex flex-col gap-3 border-b border-border py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle>
                  {fixture.home} vs {fixture.away}
                </CardTitle>
                <CardDescription>
                  {fixture.competition} · {formatKickoff(fixture.kickoff)} ·{" "}
                  {fixture.venue}, {fixture.city}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {sectors.length} sectors · {tiers.length} tiers
                </Badge>
                {effectiveView === "3d" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedId(null);
                      setResetToken((token) => token + 1);
                    }}
                  >
                    <LocateFixedIcon data-icon="inline-start" />
                    Overview
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="relative h-[28rem] p-0 sm:h-[32rem]">
              {effectiveView === "3d" ? (
                <StadiumCanvas
                  tiers={tiers}
                  sectors={sectors}
                  colors={colors}
                  renderMode={renderMode}
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  resetToken={resetToken}
                  onHover={setHoveredId}
                  onSelect={selectSector}
                />
              ) : (
                <div className="h-full p-4">
                  <StadiumPlan
                    tiers={tiers}
                    sectors={sectors}
                    currency={fixture.currency}
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    onHover={setHoveredId}
                    onSelect={selectSector}
                  />
                </div>
              )}

              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-2">
                <ul className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-border bg-card/90 px-3 py-1.5 text-xs text-card-foreground backdrop-blur">
                  <li className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-primary/60" />
                    Open
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-primary ring-2 ring-ring/40" />
                    Selected
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-sm bg-muted-foreground/25" />
                    Sold out
                  </li>
                </ul>
                {hovered && (
                  <div className="rounded-lg border border-border bg-card/90 px-3 py-1.5 text-xs text-card-foreground backdrop-blur">
                    <span className="font-semibold">{hovered.label}</span>{" "}
                    <span className="text-muted-foreground">
                      {hovered.seatsLeft > 0
                        ? `${hovered.seatsLeft} left · from ${formatMoney(hovered.bestPrice, fixture.currency)}`
                        : "sold out"}
                    </span>
                  </div>
                )}
              </div>

              {webgl === false && (
                <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-lg border border-border bg-card/90 px-3 py-1.5 text-xs text-card-foreground backdrop-blur">
                  <TriangleAlertIcon className="size-3.5 text-muted-foreground" aria-hidden />
                  WebGL 2 is unavailable, showing the 2D plan instead.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="gap-3">
            <CardHeader>
              <CardTitle>Price timeline</CardTitle>
              <CardDescription>
                Each bar rises to a sector&apos;s top price; the dot is its best
                available price. Focus the chart and use arrow keys to step
                through open sectors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PriceTimeline
                sectors={ordered}
                tiers={tiers}
                currency={fixture.currency}
                selectedId={selectedId}
                onSelect={selectSector}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <SelectionPanel
            fixture={fixture}
            tiers={tiers}
            sector={selected}
            seats={seats}
            onSeatsChange={setSeats}
            onPreview={() => setPreviewOpen(true)}
            onCheckout={checkout}
          />
          <StadiumStats
            totals={totals}
            dailySales={dailySales}
            currency={fixture.currency}
          />
        </div>
      </div>

      <SeatViewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        sector={selected}
        tiers={tiers}
      />
      <Toaster />
    </AppBody>
  );
}
