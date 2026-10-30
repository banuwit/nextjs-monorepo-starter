"use client";

import { ChartExamplePage } from "./chart-example-page";
import { SlopeRetentionCard } from "@/features/chart/slope/components/slope-retention-card";
import { SlopeServiceRankCard } from "@/features/chart/slope/components/slope-service-rank-card";
import { SlopeHighlightCard } from "@/features/chart/slope/components/slope-highlight-card";
import { SlopeChangeLabelsCard } from "@/features/chart/slope/components/slope-change-labels-card";
import { SlopeBumpCard } from "@/features/chart/slope/components/slope-bump-card";
import { SlopeDumbbellCard } from "@/features/chart/slope/components/slope-dumbbell-card";
import { SlopeDirectionCard } from "@/features/chart/slope/components/slope-direction-card";

export function SlopeChartPage() {
  return (
    <ChartExamplePage title="Slope">
      <SlopeRetentionCard />
      <SlopeServiceRankCard />
      <SlopeHighlightCard />
      <SlopeChangeLabelsCard />
      <SlopeBumpCard />
      <SlopeDumbbellCard />
      <SlopeDirectionCard />
    </ChartExamplePage>
  );
}
