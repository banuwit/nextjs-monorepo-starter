import { StarIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  hospitalityArrivalBuckets,
  hospitalityArrivals,
} from "@/mocks/dashboard-hospitality.mock";

import { formatHour, initials, loyaltyTierTones } from "../utils/hospitality";
import { StatusBadge } from "./status-badge";

export function HospitalityArrivalsTimeline({ hour }: { hour: number }) {
  const total = hospitalityArrivalBuckets.reduce(
    (sum, bucket) => sum + bucket.expected,
    0,
  );
  const peak = hospitalityArrivalBuckets.reduce(
    (max, bucket) => Math.max(max, bucket.expected),
    0,
  );
  const busiest = hospitalityArrivalBuckets.find(
    (bucket) => bucket.expected === peak,
  );
  const remaining = hospitalityArrivalBuckets
    .filter((bucket) => bucket.hour >= hour)
    .reduce((sum, bucket) => sum + bucket.expected, 0);

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Check-in rush</CardTitle>
        <CardDescription>
          {remaining} of {total} arrivals still to come
          {busiest ? `, busiest at ${formatHour(busiest.hour)}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <ol
          className="grid grid-cols-10 items-end gap-1"
          aria-label="Expected arrivals by hour"
        >
          {hospitalityArrivalBuckets.map((bucket) => {
            const current = bucket.hour === hour;
            const past = bucket.hour < hour;
            const height = peak ? (bucket.expected / peak) * 100 : 0;
            return (
              <li
                key={bucket.hour}
                className="flex min-w-0 flex-col items-center gap-1"
              >
                <span
                  className={cn(
                    "text-[0.625rem] font-medium tabular-nums",
                    current ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {bucket.expected}
                </span>
                <div
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={peak}
                  aria-valuenow={bucket.expected}
                  aria-label={`${formatHour(bucket.hour)}: ${bucket.expected} arrivals${current ? ", current hour" : ""}`}
                  className={cn(
                    "flex h-14 w-full items-end overflow-hidden rounded-sm bg-muted",
                    current &&
                      "ring-2 ring-ring ring-offset-1 ring-offset-card",
                  )}
                >
                  <div
                    className={cn(
                      "w-full rounded-sm",
                      current
                        ? "bg-primary"
                        : past
                          ? "bg-muted-foreground/40"
                          : "bg-chart-1/70",
                    )}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-[0.625rem] tabular-nums",
                    current
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {bucket.hour}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            Next arrivals
          </h3>
          <ol className="flex flex-col gap-2">
            {hospitalityArrivals.map((arrival) => (
              <li
                key={arrival.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-2.5"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full text-xs font-medium",
                    arrival.vip
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {initials(arrival.guest)}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">
                      {arrival.guest}
                    </span>
                    <StatusBadge tone={loyaltyTierTones[arrival.tier]}>
                      {arrival.tier}
                    </StatusBadge>
                    {arrival.vip && (
                      <StatusBadge tone="warning" icon={StarIcon}>
                        VIP
                      </StatusBadge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {arrival.roomType} · {arrival.preference}
                  </p>
                </div>
                <time className="shrink-0 text-xs font-medium tabular-nums">
                  {arrival.eta}
                </time>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
