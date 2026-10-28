"use client";

import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import { waterfallConfig } from "@/features/chart/waterfall/utils/waterfall-config";

export function useWaterfallLegend() {
  const legend = useChartLegendToggle();
  const toggle = (
    <ChartLegendToggle
      items={legendItemsFromConfig(waterfallConfig)}
      isHidden={legend.isHidden}
      onToggle={legend.toggle}
    />
  );
  return { ...legend, toggle };
}
