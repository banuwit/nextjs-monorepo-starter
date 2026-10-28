"use client";

import { ChartCard } from "@/components/chart/chart-card";
import type { ChartConfig } from "@/components/ui/chart";
import { SlopeChart } from "@/features/chart/slope/components/slope-chart";
import { directionColor } from "@/features/chart/slope/utils/slope-change";
import { countryLabels, shareByCountry } from "@/mocks/chart-slope.mock";

type CountryKey = keyof typeof countryLabels;

const [shareStart, shareEnd] = shareByCountry;

// Color each line by direction: rising green, falling red.
const countryConfig = Object.fromEntries(
  (Object.keys(countryLabels) as CountryKey[]).map((key) => [
    key,
    {
      label: countryLabels[key],
      color: directionColor(shareStart?.[key] ?? 0, shareEnd?.[key] ?? 0),
    },
  ]),
) satisfies ChartConfig;

export function SlopeDirectionCard() {
  return (
    <ChartCard
      title="Market share by country"
      description="Direction-colored — eight lines, green rises, red falls"
      footer="Click a country in the legend to filter the lines."
    >
      <SlopeChart
        data={shareByCountry}
        config={countryConfig}
        className="h-80"
        formatValue={(value) => `${value}%`}
      />
    </ChartCard>
  );
}
