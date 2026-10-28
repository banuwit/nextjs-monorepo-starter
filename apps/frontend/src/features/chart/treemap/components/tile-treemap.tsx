"use client";

import { Treemap } from "recharts";

import {
  ChartLegendToggle,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { createLabeledTile } from "@/features/chart/treemap/components/treemap-labeled-tile";
import type { Tile, TileOptions } from "@/features/chart/treemap/types/treemap";
import { treemapConfig } from "@/features/chart/treemap/utils/treemap-config";

/** Flat treemap with a legend that hides tiles; colors come from the data. */
export function TileTreemap({
  tiles,
  options,
  onTileClick,
}: {
  tiles: Tile[];
  options?: TileOptions;
  onTileClick?: (name: string) => void;
}) {
  const legend = useChartLegendToggle();
  const visible = tiles.filter((tile) => !legend.isHidden(tile.name));

  return (
    <>
      <ChartContainer
        config={treemapConfig}
        className="aspect-auto h-72 w-full"
      >
        <Treemap
          data={visible}
          dataKey="size"
          nameKey="name"
          aspectRatio={4 / 3}
          content={createLabeledTile(options)}
          isAnimationActive={false}
          onClick={onTileClick ? (node) => onTileClick(node.name) : undefined}
        >
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        </Treemap>
      </ChartContainer>
      <ChartLegendToggle
        items={tiles.map((tile) => ({
          key: tile.name,
          label: tile.name,
          color: tile.tileFill,
        }))}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </>
  );
}
