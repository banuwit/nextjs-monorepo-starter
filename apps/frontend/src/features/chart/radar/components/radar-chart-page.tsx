import { ChartExamplePage } from "@/features/chart/components/chart-example-page";
import { RadarMultipleCard } from "@/features/chart/radar/components/radar-multiple-card";
import { RadarGridCircleDotsCard } from "@/features/chart/radar/components/radar-grid-circle-dots-card";
import { RadarLinesOnlyCard } from "@/features/chart/radar/components/radar-lines-only-card";
import { RadarGridFillCard } from "@/features/chart/radar/components/radar-grid-fill-card";
import { RadarGridNoneCard } from "@/features/chart/radar/components/radar-grid-none-card";
import { RadarRadiusAxisCard } from "@/features/chart/radar/components/radar-radius-axis-card";
import { RadarLabelCustomCard } from "@/features/chart/radar/components/radar-label-custom-card";

export function RadarChartPage() {
  return (
    <ChartExamplePage title="Radar">
      <RadarMultipleCard />
      <RadarGridCircleDotsCard />
      <RadarLinesOnlyCard />
      <RadarGridFillCard />
      <RadarGridNoneCard />
      <RadarRadiusAxisCard />
      <RadarLabelCustomCard />
    </ChartExamplePage>
  );
}
