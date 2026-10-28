"use client";

import { ChartCard } from "@/components/chart-card";
import { ToggleTreemap } from "@/features/chart/treemap/components/toggle-treemap";
import { budgetByDepartment } from "@/mocks/chart.mock";

export function TreemapBudgetCard() {
  return (
    <ChartCard
      title="Budget by department"
      description="Nested treemap, colored by department ($K)"
      footer="Engineering accounts for more than half of the budget."
    >
      <ToggleTreemap data={budgetByDepartment} />
    </ChartCard>
  );
}
