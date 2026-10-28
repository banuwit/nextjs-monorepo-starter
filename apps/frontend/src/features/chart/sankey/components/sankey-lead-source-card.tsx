"use client";

import { useId } from "react";
import type { SankeyLinkProps } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import { FlowChart } from "@/features/chart/sankey/components/sankey-flow-chart";
import {
  getColorIndex,
  nodeColor,
} from "@/features/chart/sankey/utils/sankey-colors";
import { linkPath } from "@/features/chart/sankey/utils/sankey-link-path";
import { leadSourceFunnel } from "@/mocks/chart-sankey.mock";

/**
 * Link renderer colored by its nodes: a gradient from the source color to
 * the target color. `idPrefix` keeps gradient ids unique per chart.
 */
function createGradientLink(idPrefix: string) {
  return function GradientLink(props: SankeyLinkProps) {
    const { index, linkWidth, payload } = props;
    const id = `${idPrefix}-link-${index}`;

    return (
      <g>
        <defs>
          <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
            <stop
              offset="0%"
              stopColor={nodeColor(getColorIndex(payload.source, index))}
            />
            <stop
              offset="100%"
              stopColor={nodeColor(getColorIndex(payload.target, index))}
            />
          </linearGradient>
        </defs>
        <path
          d={linkPath(props)}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={Math.max(linkWidth, 1)}
          strokeOpacity={0.45}
        />
      </g>
    );
  };
}

export function SankeyLeadSourceCard() {
  // useId can contain characters that break `url(#id)`; keep it plain.
  const idPrefix = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <ChartCard
      title="Sales funnel by lead source"
      description="Source-colored links — gradient from source to target node"
      value="340 won deals"
      change={8.4}
      footer="Each link blends from its source color into its target color."
    >
      <FlowChart
        data={leadSourceFunnel}
        className="min-w-[30rem]"
        sankeyProps={{ link: createGradientLink(idPrefix) }}
      />
    </ChartCard>
  );
}
