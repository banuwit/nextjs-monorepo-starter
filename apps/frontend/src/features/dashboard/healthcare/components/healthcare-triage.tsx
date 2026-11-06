import { TriangleAlertIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { healthcareTriage } from "@/mocks/dashboard-healthcare.mock";

import type { HealthcareTriageLevel } from "../types/healthcare";

/** Full classes per ESI level so Tailwind keeps them. */
const levelClass: Record<
  HealthcareTriageLevel["level"],
  { bar: string; chip: string }
> = {
  1: { bar: "bg-destructive", chip: "bg-destructive text-primary-foreground" },
  2: { bar: "bg-orange-500", chip: "bg-orange-500 text-primary-foreground" },
  3: { bar: "bg-amber-500", chip: "bg-amber-500 text-primary-foreground" },
  4: { bar: "bg-chart-2", chip: "bg-chart-2 text-primary-foreground" },
  5: { bar: "bg-chart-1", chip: "bg-chart-1 text-primary-foreground" },
};

export function HealthcareTriage() {
  const total = healthcareTriage.reduce((sum, level) => sum + level.waiting, 0);
  const breaches = healthcareTriage.filter(
    (level) =>
      level.waiting > 0 && level.longestWaitMinutes > level.targetMinutes,
  );

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Triage board</CardTitle>
        <CardDescription>
          {total} waiting by ESI level
          {breaches.length
            ? `, ${breaches.length} ${breaches.length === 1 ? "level" : "levels"} past target`
            : ", all within target"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div
          role="img"
          aria-label={healthcareTriage
            .map((level) => `ESI ${level.level}: ${level.waiting}`)
            .join(", ")}
          className="flex h-3 w-full overflow-hidden rounded-full bg-muted"
        >
          {healthcareTriage.map((level) =>
            level.waiting ? (
              <div
                key={level.level}
                className={cn("h-full", levelClass[level.level].bar)}
                style={{ width: `${(level.waiting / (total || 1)) * 100}%` }}
              />
            ) : null,
          )}
        </div>
        <ol className="flex flex-col divide-y">
          {healthcareTriage.map((level) => {
            const breach =
              level.waiting > 0 &&
              level.longestWaitMinutes > level.targetMinutes;
            return (
              <li
                key={level.level}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold tabular-nums",
                    levelClass[level.level].chip,
                  )}
                >
                  {level.level}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    <span className="sr-only">ESI {level.level}, </span>
                    {level.label}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {level.targetMinutes
                      ? `Target ${level.targetMinutes} min`
                      : "Immediate"}
                    {level.waiting > 0 &&
                      ` · longest ${level.longestWaitMinutes} min`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {breach && (
                    <TriangleAlertIcon
                      className="size-4 text-destructive"
                      aria-label="Past target wait"
                    />
                  )}
                  <span
                    className={cn(
                      "text-lg font-semibold tabular-nums",
                      breach && "text-destructive",
                    )}
                  >
                    {level.waiting}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
