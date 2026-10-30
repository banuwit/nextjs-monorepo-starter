"use client";

import { ChartExamplePage } from "./chart-example-page";
import { TreemapStorageCard } from "@/features/chart/treemap/components/treemap-storage-card";
import { TreemapBudgetCard } from "@/features/chart/treemap/components/treemap-budget-card";
import { TreemapValueScaleCard } from "@/features/chart/treemap/components/treemap-value-scale-card";
import { TreemapPercentCard } from "@/features/chart/treemap/components/treemap-percent-card";
import { TreemapDrillDownCard } from "@/features/chart/treemap/components/treemap-drill-down-card";
import { TreemapGappedCard } from "@/features/chart/treemap/components/treemap-gapped-card";
import { TreemapSunburstCard } from "@/features/chart/treemap/components/treemap-sunburst-card";

export function TreemapChartPage() {
  return (
    <ChartExamplePage title="Treemap">
      <TreemapStorageCard />
      <TreemapBudgetCard />
      <TreemapValueScaleCard />
      <TreemapPercentCard />
      <TreemapDrillDownCard />
      <TreemapGappedCard />
      <TreemapSunburstCard />
    </ChartExamplePage>
  );
}
