"use client";

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

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
import { frameworkRanking } from "@/mocks/chart-slope.mock";

const frameworkConfig = {
  nova: { label: "Nova", color: "var(--chart-1)" },
  orbit: { label: "Orbit", color: "var(--chart-2)" },
  pulse: { label: "Pulse", color: "var(--chart-3)" },
  relay: { label: "Relay", color: "var(--chart-4)" },
  vector: { label: "Vector", color: "var(--chart-6)" },
} satisfies ChartConfig;

const ranks = [1, 2, 3, 4, 5];

export function SlopeBumpCard() {
  const legend = useChartLegendToggle();
  const series = Object.entries(frameworkConfig).filter(
    ([key]) => !legend.isHidden(key),
  );
  const lastIndex = frameworkRanking.length - 1;

  return (
    <ChartCard
      title="Framework downloads"
      description="Bump — rank across four quarters (1 = most downloads)"
      footer="Pulse climbed from third to first by Q4."
    >
      <ChartContainer config={frameworkConfig} className="h-72 w-full">
        <LineChart
          data={frameworkRanking}
          accessibilityLayer
          margin={{ top: 16, bottom: 8, left: 0, right: 64 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            padding={{ left: 12, right: 12 }}
          />
          <YAxis
            reversed
            domain={[1, ranks.length]}
            ticks={ranks}
            tickFormatter={(value) => `#${value}`}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          {series.map(([key, item]) => (
            <Line
              key={key}
              type="bumpX"
              dataKey={key}
              stroke={`var(--color-${key})`}
              strokeWidth={3}
              dot={{ r: 5, fill: `var(--color-${key})`, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            >
              <LabelList
                dataKey={key}
                content={({ x, y, index }) =>
                  index === lastIndex ? (
                    <text
                      x={Number(x) + 12}
                      y={Number(y)}
                      dominantBaseline="middle"
                      className="fill-foreground text-xs font-medium"
                    >
                      {item.label}
                    </text>
                  ) : null
                }
              />
            </Line>
          ))}
        </LineChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(frameworkConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
