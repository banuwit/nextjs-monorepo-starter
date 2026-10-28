import { ChartExamplePage } from "@/features/chart/components/chart-example-page";
import { PyramidButterflyCard } from "@/features/chart/pyramid/components/pyramid-butterfly-card";
import { PyramidPercentCard } from "@/features/chart/pyramid/components/pyramid-percent-card";
import { PyramidPopulationCard } from "@/features/chart/pyramid/components/pyramid-population-card";
import { PyramidStackedCard } from "@/features/chart/pyramid/components/pyramid-stacked-card";

export function PyramidChartPage() {
  return (
    <ChartExamplePage title="Pyramid">
      <PyramidPopulationCard />
      <PyramidButterflyCard />
      <PyramidStackedCard />
      <PyramidPercentCard />
    </ChartExamplePage>
  );
}
