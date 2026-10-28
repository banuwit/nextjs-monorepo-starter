"use client";

import { ChartExamplePage } from "@/features/chart/components/chart-example-page";
import { ScatterBubbleCard } from "@/features/chart/scatter/components/scatter-bubble-card";
import { ScatterTrendLineCard } from "@/features/chart/scatter/components/scatter-trend-line-card";
import { ScatterMultiGroupCard } from "@/features/chart/scatter/components/scatter-multi-group-card";
import { ScatterThresholdCellsCard } from "@/features/chart/scatter/components/scatter-threshold-cells-card";
import { ScatterMultipleYAxesCard } from "@/features/chart/scatter/components/scatter-multiple-y-axes-card";
import { ScatterJointLineCard } from "@/features/chart/scatter/components/scatter-joint-line-card";
import { ScatterQuadrantCard } from "@/features/chart/scatter/components/scatter-quadrant-card";

export function ScatterChartPage() {
  return (
    <ChartExamplePage title="Scatter">
      <ScatterBubbleCard />
      <ScatterTrendLineCard />
      <ScatterMultiGroupCard />
      <ScatterThresholdCellsCard />
      <ScatterMultipleYAxesCard />
      <ScatterJointLineCard />
      <ScatterQuadrantCard />
    </ChartExamplePage>
  );
}
