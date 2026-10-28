import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DailySale, StadiumTotals } from "../types/stadium";
import { formatCompact, formatMoney } from "../utils/stadium";

type StadiumStatsProps = {
  totals: StadiumTotals;
  dailySales: DailySale[];
  currency: string;
};

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-card p-3 text-card-foreground">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </div>
  );
}

function SalesSparkline({ sales }: { sales: DailySale[] }) {
  const width = 160;
  const height = 40;
  const max = Math.max(...sales.map((day) => day.seats));
  const min = Math.min(...sales.map((day) => day.seats));
  const points = sales.map((day, index) => {
    const x = (index / (sales.length - 1)) * width;
    const y = height - 4 - ((day.seats - min) / (max - min || 1)) * (height - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = points[points.length - 1]!.split(",");
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-10 w-full"
      role="img"
      aria-label={`Seats sold per day over the last ${sales.length} days`}
    >
      <polyline
        points={points.join(" ")}
        className="fill-none stroke-primary"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={last[0]} cy={last[1]} r={3} className="fill-primary stroke-card" strokeWidth={1.5} />
    </svg>
  );
}

export function StadiumStats({ totals, dailySales, currency }: StadiumStatsProps) {
  const lastDay = dailySales[dailySales.length - 1]!;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="Seats left"
          value={formatCompact(totals.seatsLeft)}
          hint={`of ${formatCompact(totals.capacity)} capacity`}
        />
        <StatTile
          label="Open sectors"
          value={`${totals.openSectors}`}
          hint={`${totals.soldOutSectors} sold out`}
        />
        <StatTile
          label="From"
          value={
            totals.fromPrice === null
              ? "—"
              : formatMoney(totals.fromPrice, currency)
          }
          hint="best available price"
        />
        <div className="flex flex-col gap-0.5 rounded-lg border border-border bg-card p-3 text-card-foreground">
          <span className="text-xs text-muted-foreground">Sold yesterday</span>
          <span className="text-xl font-semibold tabular-nums">
            {formatCompact(lastDay.seats)}
          </span>
          <SalesSparkline sales={dailySales} />
        </div>
      </div>

      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Tier mix</CardTitle>
          <CardDescription>Availability across the three tiers.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {totals.tiers.map((summary) => {
            const ratio = summary.capacity
              ? summary.seatsLeft / summary.capacity
              : 0;
            return (
              <div key={summary.tier.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{summary.tier.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {summary.openSectors}/{summary.totalSectors} open ·{" "}
                    {summary.fromPrice === null
                      ? "sold out"
                      : `from ${formatMoney(summary.fromPrice, currency)}`}
                  </span>
                </div>
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  role="meter"
                  aria-label={`${summary.tier.label} seats left`}
                  aria-valuemin={0}
                  aria-valuemax={summary.capacity}
                  aria-valuenow={summary.seatsLeft}
                >
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.round(ratio * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
