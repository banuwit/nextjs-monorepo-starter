import { ChartExamplePage } from "./chart-example-page";
import { RadialGaugeCard } from "@/features/chart/radial/components/radial-gauge-card";
import { RadialRingsCard } from "@/features/chart/radial/components/radial-rings-card";
import { RadialSimpleCard } from "@/features/chart/radial/components/radial-simple-card";
import { RadialLabelCard } from "@/features/chart/radial/components/radial-label-card";
import { RadialGridCard } from "@/features/chart/radial/components/radial-grid-card";
import { RadialShapeCard } from "@/features/chart/radial/components/radial-shape-card";
import { RadialStackedCard } from "@/features/chart/radial/components/radial-stacked-card";

export function RadialChartPage() {
  return (
    <ChartExamplePage title="Radial">
      <RadialGaugeCard />
      <RadialRingsCard />
      <RadialSimpleCard />
      <RadialLabelCard />
      <RadialGridCard />
      <RadialShapeCard />
      <RadialStackedCard />
    </ChartExamplePage>
  );
}
