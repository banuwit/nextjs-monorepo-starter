import { Funnel } from "recharts";

import { ChartExamplePage } from "./chart-example-page";
import { FunnelClassicCard } from "@/features/chart/funnel/components/funnel-classic-card";
import { FunnelComparisonCard } from "@/features/chart/funnel/components/funnel-comparison-card";
import { FunnelConversionCard } from "@/features/chart/funnel/components/funnel-conversion-card";
import { FunnelHorizontalCard } from "@/features/chart/funnel/components/funnel-horizontal-card";
import { FunnelReadoutCard } from "@/features/chart/funnel/components/funnel-readout-card";

export function FunnelChartPage() {
  return (
    <ChartExamplePage title="Funnel">
      <FunnelClassicCard />
      <FunnelConversionCard />
      <FunnelHorizontalCard />
      <FunnelComparisonCard />
      <FunnelReadoutCard />
    </ChartExamplePage>
  );
}
