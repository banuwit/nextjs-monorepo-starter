"use client";

import { Layer, Rectangle, type SankeyNodeProps } from "recharts";

import {
  getColorIndex,
  nodeColor,
} from "@/features/chart/sankey/utils/sankey-colors";

type SankeyNodeExtraProps = {
  /** Show the node value after its name. Defaults to true. */
  showValue?: boolean;
  /** Fade the node, e.g. when another flow is highlighted. */
  muted?: boolean;
};

/**
 * Node renderer: colored bar with the node name and value to its right.
 * The chart's right margin leaves room for the last column's labels.
 */
export function SankeyNode({
  x,
  y,
  width,
  height,
  index,
  payload,
  showValue = true,
  muted = false,
}: SankeyNodeProps & SankeyNodeExtraProps) {
  return (
    <Layer
      key={`node-${index}`}
      className="transition-opacity"
      opacity={muted ? 0.3 : 1}
    >
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        radius={2}
        fill={nodeColor(getColorIndex(payload, index))}
      />
      <text
        x={x + width + 6}
        y={y + height / 2}
        textAnchor="start"
        dominantBaseline="middle"
        // Labels overlap links; let the pointer reach the link beneath.
        className="pointer-events-none fill-foreground text-xs"
      >
        {payload.name}
        {showValue && (
          <tspan className="fill-muted-foreground"> {payload.value}</tspan>
        )}
      </text>
    </Layer>
  );
}
