"use client";

import { SunburstChart } from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartLegendToggle,
  useChartLegendToggle,
} from "@/components/chart/chart-legend-toggle";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { tileColor } from "@/features/chart/treemap/utils/treemap-colors";
import { treemapConfig } from "@/features/chart/treemap/utils/treemap-config";
import { sumBy } from "@/features/chart/utils/format";
import { budgetByDepartment } from "@/mocks/chart.mock";

export function TreemapSunburstCard() {
  const legend = useChartLegendToggle();
  const departments = budgetByDepartment.map((item, colorIndex) => ({
    ...item,
    colorIndex,
  }));
  const visible = departments.filter((item) => !legend.isHidden(item.name));

  // Every level needs an explicit `value`; children inherit the parent fill.
  const root = {
    name: "Budget",
    value: sumBy(visible, (item) => sumBy(item.children, (c) => c.size)),
    children: visible.map((item) => ({
      name: item.name,
      value: sumBy(item.children, (child) => child.size),
      fill: tileColor(item.colorIndex),
      children: item.children.map((child) => ({
        name: child.name,
        value: child.size,
      })),
    })),
  };

  return (
    <ChartCard
      title="Budget by department"
      description="Sunburst — the same hierarchy as rings ($K)"
      value={`$${(root.value / 1000).toFixed(2)}M`}
      footer="Inner ring: departments. Outer ring: teams."
    >
      <ChartContainer
        config={treemapConfig}
        className="mx-auto aspect-square h-72 w-full max-w-72"
      >
        {root.value > 0 ? (
          <SunburstChart
            data={root}
            innerRadius={36}
            padding={2}
            ringPadding={2}
            stroke="var(--card)"
            textOptions={{
              className: "pointer-events-none fill-neutral-950 text-xs",
            }}
          >
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          </SunburstChart>
        ) : (
          <div />
        )}
      </ChartContainer>
      <ChartLegendToggle
        items={departments.map((item) => ({
          key: item.name,
          label: item.name,
          color: tileColor(item.colorIndex),
        }))}
        isHidden={legend.isHidden}
        onToggle={legend.toggle}
      />
    </ChartCard>
  );
}
