"use client";

import { cn } from "cn";
import { Sankey, type SankeyNodeProps, type SankeyProps } from "recharts";

import {
  ChartLegendToggle,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { SankeyNode } from "@/features/chart/sankey/components/sankey-node";
import { SankeyTooltip } from "@/features/chart/sankey/components/sankey-tooltip";
import {
  filterSankeySources,
  getSankeySources,
  type SankeyInput,
} from "@/features/chart/sankey/utils/filter-sankey";
import { nodeColor } from "@/features/chart/sankey/utils/sankey-colors";

const flowConfig = {
  value: { label: "Value" },
} satisfies ChartConfig;

type FlowChartProps = {
  data: SankeyInput;
  /** Classes for the chart box, e.g. height and min width. */
  className?: string;
  /** Show node values next to their names. Defaults to true. */
  showValues?: boolean;
  /** Extra Sankey props, e.g. `link`, `node`, `sort` or `align`. */
  sankeyProps?: Omit<SankeyProps, "data">;
};

/** Sankey with a legend that hides source nodes and their flows. */
export function FlowChart({
  data,
  className,
  showValues = true,
  sankeyProps,
}: FlowChartProps) {
  const legend = useChartLegendToggle();
  const visible = filterSankeySources(data, legend.hidden);

  return (
    <>
      {/* Sankey labels need width; scroll horizontally on narrow screens. */}
      <div className="-mx-1 overflow-x-auto px-1">
        <ChartContainer
          config={flowConfig}
          className={cn("aspect-auto h-72 w-full min-w-[30rem]", className)}
        >
          <Sankey
            data={visible}
            node={(props: SankeyNodeProps) => (
              <SankeyNode {...props} showValue={showValues} />
            )}
            nodePadding={24}
            nodeWidth={10}
            margin={{ top: 8, right: 160, bottom: 8, left: 8 }}
            link={{ stroke: "var(--chart-2)", strokeOpacity: 0.25 }}
            {...sankeyProps}
          >
            <ChartTooltip content={SankeyTooltip} />
          </Sankey>
        </ChartContainer>
      </div>
      <ChartLegendToggle
        items={getSankeySources(data).map((node) => ({
          key: node.name,
          label: node.name,
          color: nodeColor(data.nodes.indexOf(node)),
        }))}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </>
  );
}
