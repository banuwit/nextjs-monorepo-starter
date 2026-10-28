"use client";

import { ChartCard } from "@/components/chart-card";
import { TileTreemap } from "@/features/chart/treemap/components/tile-treemap";
import type { Tile } from "@/features/chart/treemap/types/treemap";
import {
  chartShades,
  isDarkShade,
  shadeIndex,
} from "@/features/chart/treemap/utils/treemap-scale";
import { sumBy } from "@/features/chart/utils/format";
import { bundleByPackage } from "@/mocks/chart-treemap.mock";

const bundleSizes = bundleByPackage.map((item) => item.size);
const bundleMin = Math.min(...bundleSizes);
const bundleMax = Math.max(...bundleSizes);

// Shades come from the full data set so colors stay put when filtering.
const bundleTiles: Tile[] = bundleByPackage.map((item) => {
  const shade = shadeIndex(item.size, bundleMin, bundleMax);
  return {
    ...item,
    tileFill: chartShades[shade] ?? "",
    lightText: isDarkShade(shade),
    subLabel: `${item.size} KB`,
  };
});

export function TreemapValueScaleCard() {
  return (
    <ChartCard
      title="Bundle size by package"
      description="Value scale — shade by size, light to dark (KB)"
      value={`${sumBy(bundleByPackage, (item) => item.size)} KB`}
      change={-3.8}
      footer="Darker tiles are the heaviest packages."
    >
      <TileTreemap tiles={bundleTiles} />
    </ChartCard>
  );
}
