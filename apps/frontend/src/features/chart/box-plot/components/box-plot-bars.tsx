"use client";

import { Bar, type BarShapeProps } from "recharts";

import { BoxPlotShape } from "@/features/chart/box-plot/components/box-plot-shape";
import type { BoxStats } from "@/features/chart/box-plot/types/box-plot";
import { boxRange } from "@/features/chart/box-plot/utils/box-plot";

/**
 * One box series: a range `Bar` spanning min → max whose custom shape draws
 * the box, median and whiskers. Call it as a function inside a BarChart or
 * ComposedChart so Recharts sees the `Bar` as a direct child.
 */
export function BoxPlotBars({
  statsKey,
  color,
  name,
  horizontal = false,
  showMean = false,
  hide = false,
  maxBarSize = 40,
}: {
  statsKey: string;
  color: string;
  name?: string;
  horizontal?: boolean;
  showMean?: boolean;
  hide?: boolean;
  maxBarSize?: number;
}) {
  return (
    <Bar
      key={statsKey}
      dataKey={(row: Record<string, BoxStats | undefined>) => {
        // Recharts may call this for rows without the box (e.g. Scatter data).
        const stats = row[statsKey];
        return stats ? boxRange(stats) : undefined;
      }}
      name={name ?? statsKey}
      hide={hide}
      shape={(props: BarShapeProps) => (
        <BoxPlotShape
          {...props}
          statsKey={statsKey}
          color={color}
          horizontal={horizontal}
          showMean={showMean}
        />
      )}
      maxBarSize={maxBarSize}
      isAnimationActive={false}
    />
  );
}
