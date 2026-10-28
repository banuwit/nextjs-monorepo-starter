"use client";

import { cn } from "cn";
import type { TreemapNode } from "recharts";

import type { TileOptions } from "@/features/chart/treemap/types/treemap";

/** Tile renderer for flat data that carries its own color and label. */
export function createLabeledTile({
  gap = 0,
  radius = 4,
  centered = false,
  clickable = false,
}: TileOptions = {}) {
  return function Tile(node: TreemapNode) {
    const { x, y, depth, name } = node;
    if (depth === 0) return <g />;

    const width = Math.max(node.width - gap, 0);
    const height = Math.max(node.height - gap, 0);
    const left = x + gap / 2;
    const top = y + gap / 2;
    const showLabel = width > 56 && height > 36;
    const textClass =
      node.lightText === true ? "fill-white" : "fill-neutral-950";
    const subLabel = String(node.subLabel ?? "");

    return (
      <g className={cn(clickable && "cursor-pointer")}>
        <rect
          x={left}
          y={top}
          width={width}
          height={height}
          rx={radius}
          fill={String(node.tileFill ?? "")}
          className={cn(gap === 0 && "stroke-card")}
          strokeWidth={gap === 0 ? 3 : 0}
        />
        {showLabel && (
          <text
            x={centered ? left + width / 2 : left + 8}
            y={centered ? top + height / 2 - 6 : top + 18}
            textAnchor={centered ? "middle" : "start"}
            className={cn("pointer-events-none text-xs font-medium", textClass)}
          >
            {name}
            <tspan
              x={centered ? left + width / 2 : left + 8}
              dy={16}
              className="opacity-70"
            >
              {subLabel}
            </tspan>
          </text>
        )}
      </g>
    );
  };
}
