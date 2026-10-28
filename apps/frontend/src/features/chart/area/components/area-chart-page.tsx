import { ChartExamplePage } from "@/features/chart/components/chart-example-page";
import { AreaAxesIconsCard } from "@/features/chart/area/components/area-axes-icons-card";
import { AreaComparisonCard } from "@/features/chart/area/components/area-comparison-card";
import { AreaInteractiveCard } from "@/features/chart/area/components/area-interactive-card";
import { AreaLinearCard } from "@/features/chart/area/components/area-linear-card";
import { AreaStackedCard } from "@/features/chart/area/components/area-stacked-card";
import { AreaStackedExpandCard } from "@/features/chart/area/components/area-stacked-expand-card";
import { AreaStepCard } from "@/features/chart/area/components/area-step-card";

export function AreaChartPage() {
  return (
    <ChartExamplePage title="Area">
      <AreaStackedCard />
      <AreaComparisonCard />
      <AreaStepCard />
      <AreaLinearCard />
      <AreaInteractiveCard />
      <AreaStackedExpandCard />
      <AreaAxesIconsCard />
    </ChartExamplePage>
  );
}
