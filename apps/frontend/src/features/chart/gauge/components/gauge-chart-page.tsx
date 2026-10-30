import { ChartExamplePage } from "./chart-example-page";
import { GaugeNeedleCard } from "@/features/chart/gauge/components/gauge-needle-card";
import { GaugeProgressCard } from "@/features/chart/gauge/components/gauge-progress-card";
import { GaugeResourcesCard } from "@/features/chart/gauge/components/gauge-resources-card";
import { GaugeSegmentedCard } from "@/features/chart/gauge/components/gauge-segmented-card";
import { GaugeTargetCard } from "@/features/chart/gauge/components/gauge-target-card";

export function GaugeChartPage() {
  return (
    <ChartExamplePage title="Gauge">
      <GaugeNeedleCard />
      <GaugeProgressCard />
      <GaugeTargetCard />
      <GaugeSegmentedCard />
      <GaugeResourcesCard />
    </ChartExamplePage>
  );
}
