"use client";

import { Funnel, FunnelChart } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { withConversion } from "@/features/chart/funnel/utils/funnel";
import { funnelStageColors } from "@/features/chart/funnel/utils/funnel-colors";
import { hiringFunnel } from "@/mocks/chart-funnel.mock";

const hiringConfig = {
  candidates: { label: "Candidates" },
  ...Object.fromEntries(
    hiringFunnel.map((item, index) => [
      item.stage,
      { label: item.label, color: funnelStageColors[index] },
    ]),
  ),
} satisfies ChartConfig;

const hiringData = withConversion(hiringFunnel, (row) => row.candidates).map(
  (item) => ({ ...item, fill: `var(--color-${item.stage})` }),
);

export function FunnelReadoutCard() {
  const legend = useChartLegendToggle();
  const visible = hiringData.filter((item) => !legend.isHidden(item.stage));

  return (
    <ChartCard
      title="Hiring pipeline"
      description="Stage readout — rectangle-tipped funnel with a value table"
      footer="Share column is the conversion from the previous stage."
    >
      <ChartContainer config={hiringConfig} className="aspect-auto h-48 w-full">
        <FunnelChart accessibilityLayer>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="stage" hideLabel />}
          />
          <Funnel
            data={visible}
            dataKey="candidates"
            nameKey="stage"
            lastShapeType="rectangle"
          />
        </FunnelChart>
      </ChartContainer>
      <ChartLegendToggle
        variant="list"
        className="mt-4"
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
        items={hiringData.map((item, index) => ({
          key: item.stage,
          label: item.label,
          color: funnelStageColors[index] ?? "",
          value: item.candidates.toLocaleString("en-US"),
          share: item.stepRate,
        }))}
      />
    </ChartCard>
  );
}
