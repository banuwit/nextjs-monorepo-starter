import { ChartExamplePage } from "@/features/chart/components/chart-example-page";
import { BarActiveCard } from "@/features/chart/bar/components/bar-active-card";
import { BarGroupedStackedCard } from "@/features/chart/bar/components/bar-grouped-stacked-card";
import { BarHorizontalCard } from "@/features/chart/bar/components/bar-horizontal-card";
import { BarInteractiveCard } from "@/features/chart/bar/components/bar-interactive-card";
import { BarLabelCustomCard } from "@/features/chart/bar/components/bar-label-custom-card";
import { BarMixedCard } from "@/features/chart/bar/components/bar-mixed-card";
import { BarNegativeCard } from "@/features/chart/bar/components/bar-negative-card";

export function BarChartPage() {
  return (
    <ChartExamplePage title="Bar">
      <BarGroupedStackedCard />
      <BarHorizontalCard />
      <BarActiveCard />
      <BarNegativeCard />
      <BarLabelCustomCard />
      <BarMixedCard />
      <BarInteractiveCard />
    </ChartExamplePage>
  );
}
