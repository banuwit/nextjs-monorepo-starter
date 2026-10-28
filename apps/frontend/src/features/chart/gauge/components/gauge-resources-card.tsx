"use client";

import { ChartCard } from "@/components/chart-card";
import { GaugeMini } from "@/features/chart/gauge/components/gauge-mini";
import { serverResources } from "@/mocks/chart-gauge.mock";

export function GaugeResourcesCard() {
  return (
    <ChartCard
      title="Server resources"
      description="Small multiples — one compact gauge per resource"
      footer="Usage above 80% turns red."
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {serverResources.map((item) => (
          <GaugeMini key={item.resource} {...item} />
        ))}
      </div>
    </ChartCard>
  );
}
