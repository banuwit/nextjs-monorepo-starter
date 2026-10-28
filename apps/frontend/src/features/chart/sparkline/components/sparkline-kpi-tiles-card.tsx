"use client";

import { TrendBadge } from "@/components/chart/chart-card";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkline } from "@/features/chart/sparkline/components/sparkline";
import { kpiSparklines } from "@/mocks/chart.mock";

/** Grid of KPI tiles, each with a headline value and an area sparkline. */
export function SparklineKpiTilesCard() {
  return (
    <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {kpiSparklines.map((kpi) => (
        <Card key={kpi.key} size="sm">
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
              <TrendBadge change={kpi.change} />
            </div>
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              {kpi.value}
            </span>
            <Sparkline points={kpi.points} negative={kpi.change < 0} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
