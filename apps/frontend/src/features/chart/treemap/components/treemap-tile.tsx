"use client";

import type { TreemapNode } from "recharts";

import { tileColor } from "@/features/chart/treemap/utils/treemap-colors";
import { formatCompact } from "../utils/format";

/** Tile renderer: colored rectangle with name and value when it fits. */
export function TreemapTile({
  x,
  y,
  width,
  height,
  depth,
  index,
  name,
  value,
  children,
  colorIndex,
}: TreemapNode) {
  if (depth === 0) return <g />;

  // Top-level tiles carry the color; nested tiles are transparent so the
  // parent color shows through and only their borders are drawn.
  const isLeaf = !children?.length;
  const showLabel = isLeaf && width > 56 && height > 32;
  const color = tileColor(typeof colorIndex === "number" ? colorIndex : index);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        fill={depth === 1 ? color : "transparent"}
        className="stroke-card"
        strokeWidth={3}
      />
      {showLabel && (
        <text
          x={x + 8}
          y={y + 18}
          className="fill-neutral-950 text-xs font-medium"
        >
          {name}
          <tspan x={x + 8} dy={16} className="fill-neutral-950/70">
            {formatCompact(value)}
          </tspan>
        </text>
      )}
    </g>
  );
}
