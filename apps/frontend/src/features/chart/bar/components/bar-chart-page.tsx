import { ChartExamplePage } from "./chart-example-page";
import { BarActiveCard } from "@/features/chart/bar/components/bar-active-card";
import { BarGroupedStackedCard } from "@/features/chart/bar/components/bar-grouped-stacked-card";
import { BarHorizontalCard } from "@/features/chart/bar/components/bar-horizontal-card";
import { BarInteractiveCard } from "@/features/chart/bar/components/bar-interactive-card";
import { BarLabelCustomCard } from "@/features/chart/bar/components/bar-label-custom-card";
import { BarMixedCard } from "@/features/chart/bar/components/bar-mixed-card";
import { BarNegativeCard } from "@/features/chart/bar/components/bar-negative-card";
import { BarBackgroundCard } from "@/features/chart/bar/components/bar-background-card";
import { BarBiaxialCard } from "@/features/chart/bar/components/bar-biaxial-card";
import { BarCustomShapeCard } from "@/features/chart/bar/components/bar-custom-shape-card";
import { BarMultiXAxisCard } from "@/features/chart/bar/components/bar-multi-x-axis-card";
import { BarRangedCard } from "@/features/chart/bar/components/bar-ranged-card";
import { BarStackedSignCard } from "@/features/chart/bar/components/bar-stacked-sign-card";

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
      <BarBackgroundCard />
      <BarCustomShapeCard />
      <BarMultiXAxisCard />
      <BarStackedSignCard />
      <BarRangedCard />
      <BarBiaxialCard />
    </ChartExamplePage>
  );
}
