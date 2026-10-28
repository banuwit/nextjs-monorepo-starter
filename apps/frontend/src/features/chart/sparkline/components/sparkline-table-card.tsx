"use client";

import { ChartCard, TrendBadge } from "@/components/chart-card";
import { Sparkline } from "@/features/chart/sparkline/components/sparkline";
import { productTrends } from "@/mocks/chart-sparkline.mock";

export function SparklineTableCard() {
  return (
    <ChartCard
      title="Revenue by product"
      description="Table rows — sparkline + TrendBadge per row, last 8 weeks"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="py-2 font-normal">Product</th>
            <th className="py-2 font-normal">Trend</th>
            <th className="py-2 text-right font-normal">Revenue</th>
            <th className="py-2 text-right font-normal">Change</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {productTrends.map((item) => (
            <tr key={item.product}>
              <td className="py-2.5 font-medium">{item.product}</td>
              <td className="py-2.5">
                <Sparkline
                  points={item.points}
                  variant="line"
                  negative={item.change < 0}
                  className="h-8 w-24"
                />
              </td>
              <td className="py-2.5 text-right tabular-nums">{item.revenue}</td>
              <td className="py-2.5 text-right">
                <TrendBadge change={item.change} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ChartCard>
  );
}
