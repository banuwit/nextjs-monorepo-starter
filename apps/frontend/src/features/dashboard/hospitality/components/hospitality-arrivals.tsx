import { StarIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  hospitalityArrivals,
  hospitalityMovement,
} from "@/mocks/dashboard-hospitality.mock";

import { sharePercent } from "../utils/hospitality";
import { StatusBadge } from "./status-badge";

function MovementSummary({
  title,
  total,
  done,
  doneLabel,
  rest,
  restLabel,
}: {
  title: string;
  total: number;
  done: number;
  doneLabel: string;
  rest: number;
  restLabel: string;
}) {
  const percent = sharePercent(done, total);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium">{title}</span>
        <span className="text-xl font-semibold tabular-nums">{total}</span>
      </div>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-valuetext={`${done} ${doneLabel} of ${total}`}
        aria-label={title}
        className="flex h-2 gap-px overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full bg-chart-1" style={{ width: `${percent}%` }} />
        <div
          className="h-full bg-chart-3/50"
          style={{ width: `${100 - percent}%` }}
        />
      </div>
      <dl className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-full bg-chart-1" />
          <dt>{doneLabel}</dt>
          <dd className="font-medium text-foreground tabular-nums">{done}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-chart-3/50"
          />
          <dt>{restLabel}</dt>
          <dd className="font-medium text-foreground tabular-nums">{rest}</dd>
        </div>
      </dl>
    </div>
  );
}

export function HospitalityArrivals() {
  const { arrivals, departures } = hospitalityMovement;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Arrivals &amp; departures today</CardTitle>
        <CardDescription>
          {arrivals.expected} guests still to arrive, {departures.pending} rooms
          still to check out
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <MovementSummary
          title="Arrivals"
          total={arrivals.total}
          done={arrivals.checkedIn}
          doneLabel="Checked in"
          rest={arrivals.expected}
          restLabel="Expected"
        />
        <MovementSummary
          title="Departures"
          total={departures.total}
          done={departures.checkedOut}
          doneLabel="Checked out"
          rest={departures.pending}
          restLabel="Pending"
        />
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            Next arrivals
          </h3>
          <ul className="flex flex-col divide-y">
            {hospitalityArrivals.map((arrival) => (
              <li
                key={arrival.id}
                className="flex items-center gap-3 py-2 first:pt-0 last:pb-0 text-sm"
              >
                <span className="w-12 shrink-0 text-muted-foreground tabular-nums">
                  {arrival.time}
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">{arrival.guest}</span>
                  <span className="text-xs text-muted-foreground">
                    {arrival.roomType}
                  </span>
                </div>
                {arrival.vip && (
                  <StatusBadge tone="warning" icon={StarIcon}>
                    VIP
                  </StatusBadge>
                )}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
