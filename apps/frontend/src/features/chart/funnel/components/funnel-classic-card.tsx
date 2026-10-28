"use client";

import { Funnel, FunnelChart } from "recharts";

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
import { formatPercent } from "@/features/chart/funnel/utils/funnel";
import { funnelStageColors } from "@/features/chart/funnel/utils/funnel-colors";
import { signupFunnel } from "@/mocks/chart-funnel.mock";

const signupConfig = {
  users: { label: "Users" },
  ...Object.fromEntries(
    signupFunnel.map((item, index) => [
      item.stage,
      { label: item.label, color: funnelStageColors[index] },
    ]),
  ),
} satisfies ChartConfig;

const signupData = signupFunnel.map((item) => ({
  ...item,
  fill: `var(--color-${item.stage})`,
}));

export function FunnelClassicCard() {
  const legend = useChartLegendToggle();
  const visible = signupData.filter((item) => !legend.isHidden(item.stage));

  return (
    <ChartCard
      title="Sign-up funnel"
      description="Classic funnel — trapezoid stages with a name and value column"
      value={formatPercent(
        (signupFunnel.at(-1)!.users / signupFunnel[0]!.users) * 100,
      )}
      footer="Visit-to-paid conversion over the last 30 days."
    >
      {/* Labels sit in a column of equal rows that lines up with the stages. */}
      <div className="flex gap-4">
        <ChartContainer
          config={signupConfig}
          className="aspect-auto h-64 min-w-0 flex-1"
        >
          <FunnelChart
            accessibilityLayer
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="stage" hideLabel />}
            />
            <Funnel data={visible} dataKey="users" nameKey="stage" />
          </FunnelChart>
        </ChartContainer>
        <ul className="flex h-64 w-24 shrink-0 flex-col text-sm">
          {visible.map((item) => (
            <li
              key={item.stage}
              className="flex flex-1 flex-col justify-center border-b border-dashed border-border last:border-0"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium tabular-nums">
                {item.users.toLocaleString("en-US")}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <ChartLegendToggle
        items={legendItemsFromConfig(signupConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
