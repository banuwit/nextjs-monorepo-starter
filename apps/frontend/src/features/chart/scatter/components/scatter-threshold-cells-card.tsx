"use client";

import {
  CartesianGrid,
  Cell,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/chart/chart-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { endpointErrors } from "@/mocks/chart-scatter.mock";

const errorsConfig = {
  errorRate: { label: "Error rate (%)", color: "var(--chart-1)" },
  requests: { label: "Requests (K/day)" },
} satisfies ChartConfig;

export function ScatterThresholdCellsCard() {
  const { threshold, data } = endpointErrors;
  const breaches = data.filter((row) => row.errorRate > threshold).length;

  return (
    <ChartCard
      title="Endpoint error rate"
      description={`Colored cells — points above the ${threshold}% threshold use var(--destructive)`}
      value={`${breaches} / ${data.length}`}
      footer="Endpoints breaching the error budget are highlighted."
    >
      <ChartContainer config={errorsConfig} className="h-64 w-full">
        <ScatterChart
          accessibilityLayer
          margin={{ left: -12, right: 8, top: 8 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="requests"
            type="number"
            name="requests"
            unit="K"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="errorRate"
            type="number"
            name="errorRate"
            unit="%"
            tickLine={false}
            axisLine={false}
          />
          <ReferenceLine
            y={threshold}
            stroke="var(--foreground)"
            strokeDasharray="5 4"
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Scatter name="errorRate" data={data} fill="var(--color-errorRate)">
            {data.map((row) => (
              <Cell
                key={row.requests}
                fill={
                  row.errorRate > threshold
                    ? "var(--destructive)"
                    : "var(--color-errorRate)"
                }
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  );
}
