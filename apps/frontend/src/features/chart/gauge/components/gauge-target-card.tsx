"use client";

import { Label, Pie, PieChart } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  percentOf,
  polarPoint,
  valueToAngle,
} from "@/features/chart/gauge/utils/gauge";
import { ARC } from "@/features/chart/gauge/utils/gauge-config";
import { quarterlySales } from "@/mocks/chart-gauge.mock";

const salesConfig = {
  actual: { label: "Actual", color: "var(--chart-2)" },
  target: { label: "Target", color: "var(--foreground)" },
} satisfies ChartConfig;

// Fixed formatter: Intl compact currency differs between Node and browsers.
const formatThousands = (value: number) => `$${Math.round(value / 1000)}K`;

export function GaugeTargetCard() {
  const legend = useChartLegendToggle();
  const { actual, target, max } = quarterlySales;
  const showActual = !legend.isHidden("actual");
  const data = [
    {
      part: "actual",
      amount: showActual ? actual : 0,
      fill: "var(--color-actual)",
    },
    {
      part: "remaining",
      amount: max - (showActual ? actual : 0),
      fill: "var(--muted)",
    },
  ];

  return (
    <ChartCard
      title="Quarterly sales"
      description="Target marker — progress arc with a target tick"
      value={formatThousands(actual)}
      footer={`${percentOf(actual, target)}% of the ${formatThousands(target)} target.`}
    >
      <ChartContainer
        config={salesConfig}
        className="mx-auto aspect-auto h-40 w-full max-w-72"
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="part"
            startAngle={ARC.startAngle}
            endAngle={ARC.endAngle}
            cy={ARC.cy}
            innerRadius={ARC.inner}
            outerRadius={ARC.outer}
            stroke="none"
            isAnimationActive={false}
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox)) return null;
                const cx = viewBox.cx ?? 0;
                // Pie label viewBox is centered on the chart; use the arc center.
                const cy = ARC.cy;
                const angle = valueToAngle(target, 0, max);
                const from = polarPoint(cx, cy, ARC.inner - 6, angle);
                const to = polarPoint(cx, cy, ARC.outer + 6, angle);
                return (
                  <g>
                    {!legend.isHidden("target") && (
                      <line
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        strokeWidth={3}
                        strokeLinecap="round"
                        className="stroke-foreground"
                      />
                    )}
                    <text x={cx} y={cy - 24} textAnchor="middle">
                      <tspan className="fill-foreground text-2xl font-semibold">
                        {percentOf(actual, max)}%
                      </tspan>
                    </text>
                    <text
                      x={cx}
                      y={cy - 4}
                      textAnchor="middle"
                      className="fill-muted-foreground"
                    >
                      of {formatThousands(max)} cap
                    </text>
                  </g>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(salesConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
