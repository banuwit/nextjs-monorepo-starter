"use client";

import { Label, Pie, PieChart } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  legendItemsFromConfig,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { sumBy } from "../utils/format";
import { paymentMethods } from "@/mocks/chart-pie.mock";

const paymentConfig = {
  orders: { label: "Orders" },
  card: { label: "Card", color: "var(--chart-1)" },
  transfer: { label: "Bank transfer", color: "var(--chart-2)" },
  wallet: { label: "E-wallet", color: "var(--chart-3)" },
  cod: { label: "Cash on delivery", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-10)" },
} satisfies ChartConfig;

const paymentData = paymentMethods.map((item) => ({
  ...item,
  fill: `var(--color-${item.method})`,
}));

/** Pie with outside labels connected by label lines. */
export function PieLabelCard() {
  const legend = useChartLegendToggle();
  const visible = paymentData.filter((item) => !legend.isHidden(item.method));
  const total = sumBy(visible, (item) => item.orders);

  return (
    <ChartCard
      title="Payment methods"
      description="Label — outside percentage labels with label lines"
      footer="Orders by payment method this month."
    >
      <ChartContainer
        config={paymentConfig}
        className="mx-auto aspect-square h-64 [&_.recharts-pie-label-text]:fill-foreground"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="method" hideLabel />}
          />
          <Pie
            data={visible}
            dataKey="orders"
            nameKey="method"
            outerRadius="70%"
            labelLine
            label={({ value }) =>
              total ? `${Math.round((Number(value) / total) * 100)}%` : ""
            }
          />
        </PieChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(paymentConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
