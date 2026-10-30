"use client";

import { Treemap } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { createLabeledTile } from "@/features/chart/treemap/components/treemap-labeled-tile";
import { tileColor } from "@/features/chart/treemap/utils/treemap-colors";
import { treemapConfig } from "@/features/chart/treemap/utils/treemap-config";
import { withShare } from "@/features/chart/treemap/utils/treemap-scale";
import { sumBy } from "../utils/format";
import { cloudSpend } from "@/mocks/chart-treemap.mock";

export function TreemapPercentCard() {
  const legend = useChartLegendToggle();
  const items = cloudSpend.map((item, colorIndex) => ({ ...item, colorIndex }));
  // Shares are recomputed from the visible items so they add up to 100%.
  const visible = withShare(
    items.filter((item) => !legend.isHidden(item.name)),
  ).map((item) => ({
    ...item,
    tileFill: tileColor(item.colorIndex),
    subLabel: `${item.share.toFixed(1)}%`,
  }));
  const total = sumBy(visible, (item) => item.size);

  return (
    <ChartCard
      title="Cloud spend by service"
      description="Percent labels — each tile shows its share of the total"
      value={`$${(total / 1000).toFixed(1)}K`}
      change={4.6}
      footer="Hide a service to see the remaining shares."
    >
      <ChartContainer
        config={treemapConfig}
        className="aspect-auto h-72 w-full"
      >
        <Treemap
          data={visible}
          dataKey="size"
          nameKey="name"
          aspectRatio={4 / 3}
          content={createLabeledTile()}
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
    </ChartCard>
  );
}
