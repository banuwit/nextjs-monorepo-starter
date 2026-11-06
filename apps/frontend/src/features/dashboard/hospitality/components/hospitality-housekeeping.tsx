import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  hospitalityFlaggedRooms,
  hospitalityHousekeeping,
} from "@/mocks/dashboard-hospitality.mock";

import { flagReasonStyles, sharePercent } from "../utils/hospitality";
import { StatusBadge } from "./status-badge";

export function HospitalityHousekeeping() {
  const cleaned = hospitalityHousekeeping.reduce(
    (sum, team) => sum + team.cleaned,
    0,
  );
  const total = hospitalityHousekeeping.reduce(
    (sum, team) => sum + team.total,
    0,
  );

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Housekeeping</CardTitle>
        <CardDescription>
          {cleaned} of {total} rooms ready, {hospitalityFlaggedRooms.length}{" "}
          flagged
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ul className="flex flex-col gap-3">
          {hospitalityHousekeeping.map((team) => {
            const percent = sharePercent(team.cleaned, team.total);
            const behind = percent < 60;
            return (
              <li key={team.id} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-medium">{team.name}</span>
                  <span className="shrink-0 text-muted-foreground tabular-nums">
                    Cleaned{" "}
                    <span
                      className={cn(
                        "font-semibold text-foreground",
                        behind && "text-destructive",
                      )}
                    >
                      {team.cleaned}
                    </span>{" "}
                    of {team.total}
                  </span>
                </div>
                <div
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  aria-label={`${team.name} rooms cleaned`}
                  className="h-2 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className={cn(
                      "h-full rounded-full",
                      behind ? "bg-amber-500" : "bg-chart-1",
                    )}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            Flagged rooms
          </h3>
          <ul className="flex flex-col divide-y">
            {hospitalityFlaggedRooms.map((flag) => {
              const style = flagReasonStyles[flag.reason];
              return (
                <li
                  key={flag.room}
                  className="flex items-start gap-3 py-2 first:pt-0 last:pb-0"
                >
                  <span className="w-10 shrink-0 text-sm font-medium tabular-nums">
                    {flag.room}
                  </span>
                  <p className="min-w-0 flex-1 text-xs text-muted-foreground">
                    {flag.note}
                  </p>
                  <StatusBadge tone={style.tone} icon={style.icon}>
                    {style.label}
                  </StatusBadge>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
