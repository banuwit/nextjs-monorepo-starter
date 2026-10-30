"use client";

import { Pie, PieChart, Sector } from "recharts";

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
import { formatCompact } from "../utils/format";
import { planSubscribers } from "@/mocks/chart-pie.mock";

const planConfig = {
  subscribers: { label: "Subscribers" },
  free: { label: "Free", color: "var(--chart-10)" },
  starter: { label: "Starter", color: "var(--chart-2)" },
  pro: { label: "Pro", color: "var(--chart-1)" },
  team: { label: "Team", color: "var(--chart-4)" },
  enterprise: { label: "Enterprise", color: "var(--chart-3)" },
} satisfies ChartConfig;

const planData = planSubscribers.map((item) => ({
  ...item,
  fill: `var(--color-${item.plan})`,
}));

/** Donut whose largest slice (or hovered slice) is pulled out. */
export function PieDonutActiveCard() {
  const legend = useChartLegendToggle();
  const visible = planData.filter((item) => !legend.isHidden(item.plan));
  const largest = visible.reduce<(typeof visible)[number] | undefined>(
    (top, item) => (!top || item.subscribers > top.subscribers ? item : top),
    undefined,
  );

  return (
    <ChartCard
      title="Subscribers by plan"
      description="Donut active — the largest slice is highlighted"
      footer={
        largest
          ? `${largest.label} is the largest plan with ${largest.subscribers.toLocaleString("en-US")} subscribers.`
          : "No plans selected."
      }
    >
      <ChartContainer
        config={planConfig}
        className="mx-auto aspect-square h-60"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                nameKey="plan"
                hideLabel
                formatter={(value, _name, item) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {item.payload?.label}
                    </span>
                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {formatCompact(Number(value))}
                    </span>
                  </div>
                )}
              />
            }
          />
          <Pie
            data={visible}
            dataKey="subscribers"
            nameKey="plan"
            innerRadius={56}
            outerRadius={88}
            strokeWidth={4}
            shape={({ isActive, outerRadius = 0, ...props }) => (
              <Sector
                {...props}
                outerRadius={
                  isActive || props.payload?.plan === largest?.plan
                    ? outerRadius + 10
                    : outerRadius
                }
              />
            )}
          />
        </PieChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(planConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
