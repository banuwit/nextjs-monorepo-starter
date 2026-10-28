"use client";

import { Pie, PieChart } from "recharts";

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
import { formatCompact, sumBy } from "@/features/chart/utils/format";
import { storageUsage } from "@/mocks/chart-pie.mock";

const storageConfig = {
  gigabytes: { label: "Storage (GB)" },
  documents: { label: "Documents", color: "var(--chart-1)" },
  media: { label: "Media", color: "var(--chart-2)" },
  backups: { label: "Backups", color: "var(--chart-3)" },
  logs: { label: "Logs", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-10)" },
} satisfies ChartConfig;

// Each slice fills with its own gradient, so colors stay stable when filtering.
const storageData = storageUsage.map((item) => ({
  ...item,
  fill: `url(#pie-gradient-${item.type})`,
}));

export function PieGradientCard() {
  const legend = useChartLegendToggle();
  const visible = storageData.filter((item) => !legend.isHidden(item.type));
  const total = sumBy(visible, (item) => item.gigabytes);

  return (
    <ChartCard
      title="Storage usage"
      description="Gradient fill — a linear gradient per slice, built from the chart tokens"
      value={`${formatCompact(total)} GB`}
      footer="Used storage by file type."
    >
      <ChartContainer
        config={storageConfig}
        className="mx-auto aspect-square h-64"
      >
        <PieChart>
          <defs>
            {storageUsage.map((item) => (
              <linearGradient
                key={item.type}
                id={`pie-gradient-${item.type}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={`var(--color-${item.type})`} />
                <stop
                  offset="100%"
                  stopColor={`var(--color-${item.type})`}
                  stopOpacity={0.45}
                />
              </linearGradient>
            ))}
          </defs>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="type" hideLabel />}
          />
          <Pie
            data={visible}
            dataKey="gigabytes"
            nameKey="type"
            outerRadius="80%"
            stroke="var(--card)"
            strokeWidth={2}
          />
        </PieChart>
      </ChartContainer>
      <ChartLegendToggle
        items={legendItemsFromConfig(storageConfig)}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
