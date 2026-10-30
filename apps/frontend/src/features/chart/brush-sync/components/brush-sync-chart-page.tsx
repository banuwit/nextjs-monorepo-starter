import { ChartExamplePage } from "./chart-example-page";
import { BrushSyncAreaCard } from "@/features/chart/brush-sync/components/brush-sync-area-card";
import { BrushSyncAreaSyncCard } from "@/features/chart/brush-sync/components/brush-sync-area-sync-card";
import { BrushSyncBarCard } from "@/features/chart/brush-sync/components/brush-sync-bar-card";
import { BrushSyncChartsCard } from "@/features/chart/brush-sync/components/brush-sync-charts-card";
import { BrushSyncZoomCard } from "@/features/chart/brush-sync/components/brush-sync-zoom-card";

export function BrushSyncChartPage() {
  return (
    <ChartExamplePage title="Brush & Sync">
      <BrushSyncAreaCard />
      <BrushSyncBarCard />
      <BrushSyncZoomCard />
      <BrushSyncChartsCard />
      <BrushSyncAreaSyncCard />
    </ChartExamplePage>
  );
}
