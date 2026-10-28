"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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
  type ChartConfig,
} from "@/components/ui/chart";
import { PyramidTooltip } from "@/features/chart/pyramid/components/pyramid-tooltip";
import {
  formatAbs,
  mirrorRows,
  symmetricScale,
} from "@/features/chart/pyramid/utils/pyramid";
import { sumBy } from "@/features/chart/utils/format";
import { ticketsByTeam } from "@/mocks/chart-pyramid.mock";

const ticketsConfig = {
  inbound: { label: "Inbound", color: "var(--chart-3)" },
  outbound: { label: "Outbound", color: "var(--chart-5)" },
} satisfies ChartConfig;

const rows = mirrorRows(ticketsByTeam, ["inbound"]);
// Extra padding leaves room for the value labels at the bar ends.
const { domain, ticks } = symmetricScale(
  ticketsByTeam,
  [["inbound"], ["outbound"]],
  1.2,
);
const total = sumBy(ticketsByTeam, (row) => row.inbound + row.outbound);
const formatTickets = (value: number) => value.toLocaleString("en-US");

export function PyramidButterflyCard() {
  const legend = useChartLegendToggle();

  return (
    <ChartCard
      title="Tickets by team"
      description="Butterfly — two KPIs per category compared back to back"
      value={formatTickets(total)}
      change={-2.1}
      footer="Inbound on the left, outbound replies on the right."
    >
      <ChartContainer
        config={ticketsConfig}
        className="aspect-auto h-64 w-full"
      >
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
            width={80}
          />
          <XAxis
            type="number"
            domain={domain}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatAbs(value, formatTickets)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <PyramidTooltip config={ticketsConfig} format={formatTickets} />
            }
          />
          <Bar
            dataKey="inbound"
            stackId="a"
            fill="var(--color-inbound)"
            radius={[4, 0, 0, 4]}
            hide={legend.isHidden("inbound")}
          >
            <LabelList
              dataKey="inbound"
              // Negative bars flip label sides: "right" is the outer end.
              position="right"
              className="fill-foreground"
              fontSize={12}
              formatter={(value) => formatAbs(Number(value), formatTickets)}
            />
          </Bar>
          <Bar
            dataKey="outbound"
            stackId="a"
            fill="var(--color-outbound)"
            radius={[0, 4, 4, 0]}
            hide={legend.isHidden("outbound")}
          >
            <LabelList
              dataKey="outbound"
              position="right"
              className="fill-foreground"
              fontSize={12}
              formatter={(value) => formatTickets(Number(value))}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(ticketsConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
