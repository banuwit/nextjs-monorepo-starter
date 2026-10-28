"use client";

import { Label, Pie, PieChart } from "recharts";

import { ChartCard } from "@/components/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { needlePath, valueToAngle } from "@/features/chart/gauge/utils/gauge";
import {
  ARC,
  bandColors,
  bandOf,
} from "@/features/chart/gauge/utils/gauge-config";
import { healthScore } from "@/mocks/chart-gauge.mock";

const healthConfig = Object.fromEntries(
  healthScore.bands.map((item, index) => [
    item.band,
    { label: item.label, color: bandColors[index] },
  ]),
) satisfies ChartConfig;

export function GaugeNeedleCard() {
  const legend = useChartLegendToggle();
  const { value, bands } = healthScore;
  // Hidden bands stay in place (muted) so the scale does not shift.
  const data = bands.map((item) => ({
    ...item,
    size: item.to - item.from,
    fill: legend.isHidden(item.band)
      ? "var(--muted)"
      : `var(--color-${item.band})`,
  }));

  return (
    <ChartCard
      title="Account health"
      description="Half circle — needle gauge over poor, fair, and good bands"
      value={value}
      footer={`Score is in the ${bandOf(bands, value).label.toLowerCase()} band.`}
    >
      <ChartContainer
        config={healthConfig}
        className="mx-auto aspect-auto h-40 w-full max-w-72"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="band" hideLabel />}
          />
          <Pie
            data={data}
            dataKey="size"
            nameKey="band"
            startAngle={ARC.startAngle}
            endAngle={ARC.endAngle}
            cy={ARC.cy}
            innerRadius={ARC.inner}
            outerRadius={ARC.outer}
            paddingAngle={2}
            stroke="none"
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                const cx = viewBox.cx ?? 0;
                // Pie label viewBox is centered on the chart; use the arc center.
                const cy = ARC.cy;
                const angle = valueToAngle(value);
                return (
                  <g className="fill-foreground">
                    <path d={needlePath(cx, cy, ARC.outer - 6, angle)} />
                    <circle cx={cx} cy={cy} r={8} />
                  </g>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(healthConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
