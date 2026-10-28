"use client";

import type { BarShapeProps } from "recharts";

import type { BoxStats } from "@/features/chart/box-plot/types/box-plot";

type BoxPlotShapeProps = BarShapeProps & {
  /** Row field holding the box, e.g. `"box"` or `"current"`. */
  statsKey: string;
  color: string;
  /** `layout="vertical"` charts: the value axis runs left → right. */
  horizontal?: boolean;
  /** Draws the mean as a hollow dot. */
  showMean?: boolean;
};

/**
 * Custom `Bar` shape for a range bar spanning min → max. Recharts gives the
 * pixel span of that range; Q1, median, Q3 and mean are placed on it by
 * linear interpolation, then the box, median line and whiskers are drawn.
 */
export function BoxPlotShape({
  statsKey,
  color,
  horizontal = false,
  showMean = false,
  ...props
}: BoxPlotShapeProps) {
  const stats = (props.payload as Record<string, BoxStats> | undefined)?.[
    statsKey
  ];
  if (!stats) return null;
  const { x, y, width, height } = props;

  // Pixel position of the min/max ends along the value axis.
  const start = horizontal ? Math.min(x, x + width) : Math.max(y, y + height);
  const end = horizontal ? Math.max(x, x + width) : Math.min(y, y + height);
  const span = stats.max - stats.min;
  const at = (value: number) =>
    span === 0 ? start : start + ((value - stats.min) / span) * (end - start);

  // Cross-axis: center line and thickness of the box.
  const thickness = horizontal ? Math.abs(height) : Math.abs(width);
  const center = horizontal
    ? Math.min(y, y + height) + thickness / 2
    : Math.min(x, x + width) + thickness / 2;
  const cap = thickness / 4;

  const q1 = at(stats.q1);
  const q3 = at(stats.q3);
  const median = at(stats.median);

  // Draws a segment given value-axis (v) and cross-axis (c) coordinates.
  const line = (v1: number, c1: number, v2: number, c2: number) =>
    horizontal
      ? { x1: v1, y1: c1, x2: v2, y2: c2 }
      : { x1: c1, y1: v1, x2: c2, y2: v2 };

  const box = horizontal
    ? {
        x: Math.min(q1, q3),
        y: center - thickness / 2,
        width: Math.abs(q3 - q1),
        height: thickness,
      }
    : {
        x: center - thickness / 2,
        y: Math.min(q1, q3),
        width: thickness,
        height: Math.abs(q3 - q1),
      };

  return (
    <g>
      <g stroke={color} strokeWidth={1.5}>
        <line {...line(start, center, q1, center)} />
        <line {...line(q3, center, end, center)} />
        <line {...line(start, center - cap, start, center + cap)} />
        <line {...line(end, center - cap, end, center + cap)} />
      </g>
      <rect
        {...box}
        rx={2}
        fill={color}
        fillOpacity={0.35}
        stroke={color}
        strokeWidth={1.5}
      />
      <line
        {...line(
          median,
          center - thickness / 2,
          median,
          center + thickness / 2,
        )}
        stroke="var(--foreground)"
        strokeWidth={2}
      />
      {showMean && stats.mean !== undefined && (
        <circle
          {...(horizontal
            ? { cx: at(stats.mean), cy: center }
            : { cx: center, cy: at(stats.mean) })}
          r={3.5}
          fill="var(--background)"
          stroke="var(--foreground)"
          strokeWidth={1.5}
        />
      )}
    </g>
  );
}
