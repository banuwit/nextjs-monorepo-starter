"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { PyramidTooltip } from "@/features/chart/pyramid/components/pyramid-tooltip";
import {
  formatAbs,
  mirrorRows,
  symmetricScale,
} from "@/features/chart/pyramid/utils/pyramid";
import { formatCompact, sumBy } from "../utils/format";
import { populationByAge } from "@/mocks/chart-pyramid.mock";

const populationConfig = {
  male: { label: "Male", color: "var(--chart-4)" },
  female: { label: "Female", color: "var(--chart-2)" },
} satisfies ChartConfig;

// Male bars are negative so they grow to the left of the center axis.
const rows = mirrorRows(populationByAge, ["male"]);
const { domain, ticks } = symmetricScale(populationByAge, [
  ["male"],
  ["female"],
]);
const total = sumBy(populationByAge, (row) => row.male + row.female);
// Values are in thousands.
const formatPeople = (value: number) => formatCompact(value * 1000);

export function PyramidPopulationCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Population"
      description="Population — male bars mirrored left with stackOffset sign, absolute ticks"
      value={formatPeople(total)}
      change={0.8}
      footer="Ticks and tooltip drop the sign so both sides read as positive."
    >
      <ChartContainer
        config={populationConfig}
        className="aspect-auto h-72 w-full"
      >
        <BarChart
          data={rows}
          layout="vertical"
          stackOffset="sign"
          barCategoryGap={2}
          accessibilityLayer
          margin={{ left: 0, right: 12 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="label"
            type="category"
            reversed
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <XAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatAbs(value, formatPeople)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <PyramidTooltip config={populationConfig} format={formatPeople} />
            }
          />
          <Bar
            dataKey="male"
            stackId="a"
            fill="var(--color-male)"
            radius={[4, 0, 0, 4]}
            hide={legend.isHidden("male")}
          />
          <Bar
            dataKey="female"
            stackId="a"
            fill="var(--color-female)"
            radius={[0, 4, 4, 0]}
            hide={legend.isHidden("female")}
          />
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(populationConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
