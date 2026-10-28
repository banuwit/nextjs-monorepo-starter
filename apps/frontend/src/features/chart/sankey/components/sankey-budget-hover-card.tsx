"use client";

import { useState } from "react";
import type { SankeyLinkProps, SankeyNodeProps } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import { FlowChart } from "@/features/chart/sankey/components/sankey-flow-chart";
import { SankeyNode } from "@/features/chart/sankey/components/sankey-node";
import { linkPath } from "@/features/chart/sankey/utils/sankey-link-path";
import { budgetAllocation } from "@/mocks/chart-sankey.mock";

type Hover =
  | { kind: "link"; source: string; target: string }
  | { kind: "node"; name: string };

type NamedLink = { source: { name: string }; target: { name: string } };

/** Whether a link is part of the hovered link or touches the hovered node. */
function isLinkActive(hover: Hover | null, link: NamedLink) {
  if (!hover) return true;
  if (hover.kind === "link") {
    return (
      link.source.name === hover.source && link.target.name === hover.target
    );
  }
  return link.source.name === hover.name || link.target.name === hover.name;
}

/** Whether a node is the hovered node, a neighbor, or an end of the link. */
function isNodeActive(hover: Hover | null, name: string) {
  if (!hover) return true;
  if (hover.kind === "link") {
    return name === hover.source || name === hover.target;
  }
  if (name === hover.name) return true;
  const { nodes, links } = budgetAllocation;
  return links.some((link) => {
    const source = nodes[link.source]?.name;
    const target = nodes[link.target]?.name;
    return (
      (source === hover.name && target === name) ||
      (target === hover.name && source === name)
    );
  });
}

export function SankeyBudgetHoverCard() {
  const [hover, setHover] = useState<Hover | null>(null);

  return (
    <ChartCard
      title="Budget allocation"
      description="Hover highlight — focus one flow, fade the rest ($K)"
      value="$1.3M"
      change={5.6}
      footer="Hover a link or node; unrelated flows fade out."
    >
      <FlowChart
        data={budgetAllocation}
        className="min-w-[30rem]"
        sankeyProps={{
          nodePadding: 16,
          onMouseEnter: (item, type) => {
            if (type === "link") {
              const { payload } = item as SankeyLinkProps;
              setHover({
                kind: "link",
                source: payload.source.name,
                target: payload.target.name,
              });
            } else {
              const { payload } = item as SankeyNodeProps;
              setHover({ kind: "node", name: payload.name });
            }
          },
          onMouseLeave: () => setHover(null),
          node: (props: SankeyNodeProps) => (
            <SankeyNode
              {...props}
              muted={!isNodeActive(hover, props.payload.name)}
            />
          ),
          link: (props: SankeyLinkProps) => (
            <path
              d={linkPath(props)}
              fill="none"
              stroke="var(--chart-3)"
              strokeWidth={Math.max(props.linkWidth, 1)}
              strokeOpacity={isLinkActive(hover, props.payload) ? 0.45 : 0.08}
              className="transition-[stroke-opacity]"
            />
          ),
        }}
      />
    </ChartCard>
  );
}
