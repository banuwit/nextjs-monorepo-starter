"use client";

import { Treemap } from "recharts";

import {
  ChartLegendToggle,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TreemapTile } from "@/features/chart/treemap/components/treemap-tile";
import type { TreemapItem } from "@/features/chart/treemap/types/treemap";
import { tileColor } from "@/features/chart/treemap/utils/treemap-colors";
import { treemapConfig } from "@/features/chart/treemap/utils/treemap-config";

/** Treemap whose top-level items can be hidden from the legend. */
export function ToggleTreemap({ data }: { data: TreemapItem[] }) {
  const legend = useChartLegendToggle();
  // `colorIndex` keeps each item's color stable when others are hidden.
  const items = data.map((item, colorIndex) => ({ ...item, colorIndex }));
  const visible = items.filter((item) => !legend.isHidden(item.name));

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
          content={TreemapTile}
          isAnimationActive={false}
        >
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        </Treemap>
      </ChartContainer>
      <ChartLegendToggle
        items={items.map((item) => ({
          key: item.name,
          label: item.name,
          color: tileColor(item.colorIndex),
        }))}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </>
  );
}
