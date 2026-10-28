"use client";

import { Label, Pie, PieChart } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { gaugeSegments } from "@/features/chart/gauge/utils/gauge";
import {
  ARC,
  bandColors,
  bandOf,
} from "@/features/chart/gauge/utils/gauge-config";
import { customerSatisfaction } from "@/mocks/chart-gauge.mock";

const satisfactionConfig = Object.fromEntries(
  customerSatisfaction.bands.map((item, index) => [
    item.band,
    { label: item.label, color: bandColors[index] },
  ]),
) satisfies ChartConfig;

const satisfactionSegments = gaugeSegments(20);

export function GaugeSegmentedCard() {
  const legend = useChartLegendToggle();
  const { value, bands } = customerSatisfaction;
  const current = bandOf(bands, value);
  // Segments up to the value take their band color; the rest stay muted.
  const data = satisfactionSegments.map((segment) => {
    const band = bandOf(bands, segment.from);
    const lit = segment.from < value && !legend.isHidden(band.band);
    return {
      ...segment,
      band: band.band,
      fill: lit ? `var(--color-${band.band})` : "var(--muted)",
    };
  });

  return (
    <ChartCard
      title="Customer satisfaction"
      description="Segmented — 20 ticks colored by band up to the score"
      footer="Survey responses from the last 90 days."
    >
      <ChartContainer
        config={satisfactionConfig}
        className="mx-auto aspect-auto h-40 w-full max-w-72"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="band"
            startAngle={ARC.startAngle}
            endAngle={ARC.endAngle}
            cy={ARC.cy}
            innerRadius={ARC.inner + 6}
            outerRadius={ARC.outer}
            paddingAngle={2}
            cornerRadius={2}
            stroke="none"
            isAnimationActive={false}
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                return (
                  <text x={viewBox.cx} y={ARC.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={ARC.cy - 24}
                      className="fill-foreground text-3xl font-semibold"
                    >
                      {value}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={ARC.cy - 4}
                      className="fill-muted-foreground"
                    >
                      {current.label}
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(satisfactionConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
