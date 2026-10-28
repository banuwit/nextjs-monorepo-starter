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
  formatPercent,
  mirrorRows,
  symmetricScale,
  toSideShare,
} from "@/features/chart/pyramid/utils/pyramid";
import { sumBy } from "@/features/chart/utils/format";
import { employeesByTenure } from "@/mocks/chart-pyramid.mock";

const tenureConfig = {
  emea: { label: "EMEA", color: "var(--chart-3)" },
  americas: { label: "Americas", color: "var(--chart-1)" },
} satisfies ChartConfig;

// Each side sums to 100%, so regions of different size compare fairly.
const shares = toSideShare(employeesByTenure, ["emea", "americas"]);
const rows = mirrorRows(shares, ["emea"]);
const { domain, ticks } = symmetricScale(shares, [["emea"], ["americas"]]);
const headcount = sumBy(employeesByTenure, (row) => row.emea + row.americas);

export function PyramidPercentCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Tenure mix"
      description="Percent — each band as a share of its side's total"
      value={headcount}
      footer="Employees by tenure. Each region adds up to 100%."
    >
      <ChartContainer config={tenureConfig} className="aspect-auto h-64 w-full">
        <BarChart
          data={rows}
          layout="vertical"
          stackOffset="sign"
          accessibilityLayer
          margin={{ left: 0, right: 12 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            axisLine={false}
            width={64}
          />
          <XAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatAbs(value, formatPercent)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <PyramidTooltip config={tenureConfig} format={formatPercent} />
            }
          />
          <Bar
            dataKey="emea"
            stackId="a"
            fill="var(--color-emea)"
            radius={[4, 0, 0, 4]}
            hide={legend.isHidden("emea")}
          />
          <Bar
            dataKey="americas"
            stackId="a"
            fill="var(--color-americas)"
            radius={[0, 4, 4, 0]}
            hide={legend.isHidden("americas")}
          />
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(tenureConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
