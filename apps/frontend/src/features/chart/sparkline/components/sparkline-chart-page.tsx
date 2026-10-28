"use client";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { SparklineBarCard } from "@/features/chart/sparkline/components/sparkline-bar-card";
import { SparklineKpiTilesCard } from "@/features/chart/sparkline/components/sparkline-kpi-tiles-card";
import { SparklineMarkersCard } from "@/features/chart/sparkline/components/sparkline-markers-card";
import { SparklineServiceListCard } from "@/features/chart/sparkline/components/sparkline-service-list-card";
import { SparklineTableCard } from "@/features/chart/sparkline/components/sparkline-table-card";
import { SparklineTargetCard } from "@/features/chart/sparkline/components/sparkline-target-card";
import { SparklineWinLossCard } from "@/features/chart/sparkline/components/sparkline-win-loss-card";

export function SparklineChartPage() {
  return (
    <AppBody>
      <PageHeading title="Sparkline Chart" currentPage="Sparkline" />
      <SparklineKpiTilesCard />
      <SparklineServiceListCard />
      <div className="grid gap-4 @4xl/main:grid-cols-2">
        <SparklineBarCard />
        <SparklineWinLossCard />
        <SparklineTargetCard />
        <SparklineMarkersCard />
        <SparklineTableCard />
      </div>
    </AppBody>
  );
}
