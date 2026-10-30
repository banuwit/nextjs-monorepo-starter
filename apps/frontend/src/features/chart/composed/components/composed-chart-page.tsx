"use client";

import { ChartExamplePage } from "./chart-example-page";
import { ComposedGoalLineCard } from "@/features/chart/composed/components/composed-goal-line-card";
import { ComposedCashflowCard } from "@/features/chart/composed/components/composed-cashflow-card";
import { ComposedLineBarAreaCard } from "@/features/chart/composed/components/composed-line-bar-area-card";
import { ComposedVerticalCard } from "@/features/chart/composed/components/composed-vertical-card";
import { ComposedBiaxialCard } from "@/features/chart/composed/components/composed-biaxial-card";
import { ComposedRangeBandCard } from "@/features/chart/composed/components/composed-range-band-card";
import { ComposedTargetBandCard } from "@/features/chart/composed/components/composed-target-band-card";

export function ComposedChartPage() {
  return (
    <ChartExamplePage title="Composed">
      <ComposedGoalLineCard />
      <ComposedCashflowCard />
      <ComposedLineBarAreaCard />
      <ComposedVerticalCard />
      <ComposedBiaxialCard />
      <ComposedRangeBandCard />
      <ComposedTargetBandCard />
    </ChartExamplePage>
  );
}
