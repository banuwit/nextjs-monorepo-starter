import { TrophyIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { initials, usdWhole } from "@/features/dashboard/utils/format";
import { cn } from "@/lib/utils";
import { salesReps } from "@/mocks/dashboard-sales.mock";

export function SalesLeaderboard() {
  const reps = [...salesReps].sort((a, b) => b.closed / b.quota - a.closed / a.quota);
  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Team today</CardTitle>
        <CardDescription>Closed revenue against each daily quota</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-3.5">
          {reps.map((rep, index) => {
            const attainment = Math.round((rep.closed / rep.quota) * 100);
            return (
              <li key={rep.name} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium",
                    index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {initials(rep.name)}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-1.5 truncate font-medium">
                      {rep.name}
                      {index === 0 && (
                        <TrophyIcon className="size-3.5 shrink-0 text-amber-500" aria-label="Top performer" />
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {usdWhole.format(rep.closed)} of {usdWhole.format(rep.quota)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(attainment, 100)}%` }}
                      />
                    </div>
                    <span className="w-9 text-right text-xs font-medium tabular-nums">{attainment}%</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
