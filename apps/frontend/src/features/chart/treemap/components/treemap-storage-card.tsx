"use client";

import { ChartCard } from "@/components/chart-card";
import { ToggleTreemap } from "@/features/chart/treemap/components/toggle-treemap";
import { sumBy } from "@/features/chart/utils/format";
import { storageByFolder } from "@/mocks/chart.mock";

export function TreemapStorageCard() {
  const storageTotal = sumBy(storageByFolder, (item) => item.size);

  return (
    <ChartCard
      title="Storage by folder"
      description="Flat treemap, tile area = size in MB"
      value={`${(storageTotal / 1000).toFixed(1)} GB`}
      change={7.3}
    >
      <ToggleTreemap data={storageByFolder} />
    </ChartCard>
  );
}
