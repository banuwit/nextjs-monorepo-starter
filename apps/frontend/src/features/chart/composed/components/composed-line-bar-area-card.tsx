"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
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
import { sumBy } from "@/features/chart/utils/format";
import { funnelTrend } from "@/mocks/chart-composed.mock";

const funnelConfig = {
  sessions: { label: "Sessions", color: "var(--chart-2)" },
  signups: { label: "Signups", color: "var(--chart-4)" },
  activations: { label: "Activations", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ComposedLineBarAreaCard() {
  const legend = useChartLegendToggle();
  const signups = sumBy(funnelTrend, (row) => row.signups);

  return (
    <ChartCard
      title="Acquisition funnel"
      description="Line, bar & area — three series types on one shared axis"
      value={signups.toLocaleString("en-US")}
      change={11.8}
      footer="Signups for the half-year, with sessions and activations for context."
    >
      <ChartContainer config={funnelConfig} className="h-64 w-full">
        <ComposedChart
          data={funnelTrend}
          accessibilityLayer
          margin={{ left: -20, right: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="sessions"
            type="monotone"
            fill="var(--color-sessions)"
            fillOpacity={0.4}
            stroke="var(--color-sessions)"
            hide={legend.isHidden("sessions")}
          />
          <Bar
            dataKey="signups"
            fill="var(--color-signups)"
            radius={4}
            maxBarSize={28}
            hide={legend.isHidden("signups")}
          />
          <Line
            dataKey="activations"
            type="monotone"
            stroke="var(--color-activations)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--color-activations)" }}
            hide={legend.isHidden("activations")}
          />
        </ComposedChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(funnelConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
