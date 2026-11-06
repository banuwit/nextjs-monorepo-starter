import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  humanResourceLeaveApprovals,
  humanResourceLeaveToday,
} from "@/mocks/dashboard-human-resource.mock";

import {
  formatShortDate,
  initials,
  leaveTypeStyles,
} from "../utils/human-resource";
import { StatusBadge } from "./status-badge";

export function HumanResourceLeaveToday() {
  const away = humanResourceLeaveToday.filter(
    (entry) => entry.type !== "remote",
  ).length;
  const progress = Math.round(
    (humanResourceLeaveApprovals.pending / humanResourceLeaveApprovals.total) *
      100,
  );

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Out of office today</CardTitle>
        <CardDescription>
          {away} away, {humanResourceLeaveToday.length - away} working remotely
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <ol className="flex flex-col divide-y">
          {humanResourceLeaveToday.map((entry) => {
            const style = leaveTypeStyles[entry.type];
            return (
              <li
                key={entry.id}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <Avatar size="sm">
                  <AvatarFallback>{initials(entry.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{entry.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {entry.department} · back{" "}
                    <time dateTime={entry.backOn} className="tabular-nums">
                      {formatShortDate(entry.backOn)}
                    </time>
                  </p>
                </div>
                <StatusBadge
                  tone={style.tone}
                  icon={style.icon}
                  className="shrink-0"
                >
                  {style.label}
                </StatusBadge>
              </li>
            );
          })}
        </ol>
        <div className="mt-auto flex flex-col gap-2 rounded-lg bg-muted/60 p-3">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium">Leave requests pending approval</span>
            <span className="tabular-nums">
              <span className="font-semibold">
                {humanResourceLeaveApprovals.pending}
              </span>
              <span className="text-muted-foreground">
                {" "}
                of {humanResourceLeaveApprovals.total}
              </span>
            </span>
          </div>
          <Progress
            value={progress}
            aria-label={`${humanResourceLeaveApprovals.pending} of ${humanResourceLeaveApprovals.total} leave requests still waiting for approval`}
          />
          <p className="text-xs text-muted-foreground">
            {humanResourceLeaveApprovals.total -
              humanResourceLeaveApprovals.pending}{" "}
            approved this week.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
