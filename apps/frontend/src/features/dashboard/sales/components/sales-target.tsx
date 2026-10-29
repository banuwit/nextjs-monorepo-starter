import { Card, CardContent } from "@/components/ui/card";
import { TrendDelta } from "@/features/dashboard/components/trend-delta";
import { integer, percentChange, usd, usdWhole } from "@/features/dashboard/utils/format";
import type { Delta } from "@/features/dashboard/types/dashboard";
import { cn } from "@/lib/utils";

export function SalesTarget({
  revenue,
  orders,
  yesterdayRevenue,
  yesterdayOrders,
  target,
  expected,
  visitors,
  conversion,
}: {
  revenue: number;
  orders: number;
  yesterdayRevenue: number;
  yesterdayOrders: number;
  target: number;
  expected: number;
  visitors: number;
  /** Share of today's sessions that placed an order, in percent. */
  conversion: number;
}) {
  const progress = Math.min(100, (revenue / target) * 100);
  const pace = Math.min(100, (expected / target) * 100);
  const gap = revenue - expected;
  const ahead = gap >= 0;
  const revenueChange = percentChange(revenue, yesterdayRevenue);
  const ordersChange = percentChange(orders, yesterdayOrders);
  const average = orders ? revenue / orders : 0;

  const stats: { label: string; value: string; delta?: Delta | null }[] = [
    {
      label: "Orders",
      value: integer.format(orders),
      delta: ordersChange && {
        ...ordersChange,
        sentiment: ordersChange.direction === "down" ? "bad" : "good",
      },
    },
    { label: "Average order", value: usd.format(average) },
    { label: "Conversion", value: `${conversion.toFixed(1)}%` },
    { label: "Visitors, last hour", value: integer.format(visitors) },
  ];

  return (
    <Card className="min-w-0">
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Revenue today</p>
              <p className="text-4xl font-semibold tracking-tight">{usdWhole.format(revenue)}</p>
            </div>
            <p className="flex flex-wrap items-center gap-x-1.5 pb-1 text-sm text-muted-foreground">
              {revenueChange && (
                <TrendDelta
                  className="text-sm"
                  delta={{
                    ...revenueChange,
                    sentiment: revenueChange.direction === "down" ? "bad" : "good",
                  }}
                />
              )}
              vs this time yesterday
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div
              className="relative h-3 rounded-full bg-muted"
              role="progressbar"
              aria-label="Progress to today's revenue target"
              aria-valuemin={0}
              aria-valuemax={target}
              aria-valuenow={Math.round(revenue)}
              aria-valuetext={`${usdWhole.format(revenue)} of ${usdWhole.format(target)}`}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-700 motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
              <span
                aria-hidden="true"
                className="absolute -top-1 -bottom-1 w-0.5 rounded-full bg-foreground"
                style={{ left: `${pace}%` }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">
                {Math.round(progress)}% of {usdWhole.format(target)} daily target
              </span>
              <span
                className={cn(
                  "font-medium",
                  ahead ? "text-emerald-700 dark:text-emerald-400" : "text-destructive",
                )}
              >
                {ahead ? "Ahead of" : "Behind"} pace by {usdWhole.format(Math.abs(gap))}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              The marker shows where revenue should be by now to reach the target.
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 bg-card p-3">
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-semibold">{stat.value}</span>
                {stat.delta && <TrendDelta delta={stat.delta} />}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
