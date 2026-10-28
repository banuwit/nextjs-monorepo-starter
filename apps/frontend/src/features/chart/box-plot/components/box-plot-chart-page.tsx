import { BoxPlotBasicCard } from "@/features/chart/box-plot/components/box-plot-basic-card";
import { BoxPlotGroupedCard } from "@/features/chart/box-plot/components/box-plot-grouped-card";
import { BoxPlotHorizontalCard } from "@/features/chart/box-plot/components/box-plot-horizontal-card";
import { BoxPlotMeanCard } from "@/features/chart/box-plot/components/box-plot-mean-card";
import { BoxPlotOutliersCard } from "@/features/chart/box-plot/components/box-plot-outliers-card";
import { ChartExamplePage } from "@/features/chart/components/chart-example-page";

export function BoxPlotChartPage() {
  return (
    <ChartExamplePage title="Box Plot">
      <BoxPlotBasicCard />
      <BoxPlotHorizontalCard />
      <BoxPlotOutliersCard />
      <BoxPlotGroupedCard />
      <BoxPlotMeanCard />
    </ChartExamplePage>
  );
}
