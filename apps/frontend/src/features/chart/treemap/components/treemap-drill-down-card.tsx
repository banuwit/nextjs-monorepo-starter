"use client";

import { useState } from "react";
import { ChevronLeftIcon } from "lucide-react";

import { ChartCard } from "@/components/chart-card";
import { Button } from "@/components/ui/button";
import { TileTreemap } from "@/features/chart/treemap/components/tile-treemap";
import type { Tile } from "@/features/chart/treemap/types/treemap";
import { tileColor } from "@/features/chart/treemap/utils/treemap-colors";
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import { headcountByRegion } from "@/mocks/chart-treemap.mock";

function toTiles(items: readonly { name: string; size: number }[]): Tile[] {
  return items.map((item, index) => ({
    ...item,
    tileFill: tileColor(index),
    subLabel: `${formatCompact(item.size)} people`,
  }));
}

const regionTiles = toTiles(
  headcountByRegion.map((region) => ({
    name: region.name,
    size: sumBy(region.children, (child) => child.size),
  })),
);

export function TreemapDrillDownCard() {
  const [regionName, setRegionName] = useState<string | null>(null);
  const region = headcountByRegion.find((item) => item.name === regionName);
  const tiles = region ? toTiles(region.children) : regionTiles;

  return (
    <ChartCard
      title="Headcount by region"
      description="Drill-down — click a region to zoom into its countries"
      value={formatCompact(sumBy(tiles, (tile) => tile.size))}
      footer={
        region
          ? `Showing countries in ${region.name}.`
          : "Click a tile to see its countries."
      }
    >
      <div className="flex h-8 items-center gap-1 pb-2 text-sm">
        {region ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRegionName(null)}
            >
              <ChevronLeftIcon data-icon="inline-start" aria-hidden="true" />
              All regions
            </Button>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{region.name}</span>
          </>
        ) : (
          <span className="px-2.5 font-medium">All regions</span>
        )}
      </div>
      {/* `key` resets the legend when the level changes. */}
      <TileTreemap
        key={region?.name ?? "root"}
        tiles={tiles}
        options={{ clickable: !region }}
        onTileClick={region ? undefined : setRegionName}
      />
    </ChartCard>
  );
}
