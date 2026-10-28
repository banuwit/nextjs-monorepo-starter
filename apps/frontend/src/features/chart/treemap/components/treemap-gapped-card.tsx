"use client";

import { ChartCard } from "@/components/chart-card";
import { TileTreemap } from "@/features/chart/treemap/components/tile-treemap";
import type { Tile } from "@/features/chart/treemap/types/treemap";
import { tileColor } from "@/features/chart/treemap/utils/treemap-colors";
import { sumBy } from "@/features/chart/utils/format";
import { issuesByLabel } from "@/mocks/chart-treemap.mock";

const issueTiles: Tile[] = issuesByLabel.map((item, index) => ({
  ...item,
  tileFill: tileColor(index),
  subLabel: String(item.size),
}));

export function TreemapGappedCard() {
  return (
    <ChartCard
      title="Open issues by label"
      description="Gapped — spacing and rounded tiles, centered labels"
      value={sumBy(issuesByLabel, (item) => item.size)}
      change={-6.2}
      footer="Gaps let the card background separate the tiles."
    >
      <TileTreemap
        tiles={issueTiles}
        options={{ gap: 8, radius: 8, centered: true }}
      />
    </ChartCard>
  );
}
