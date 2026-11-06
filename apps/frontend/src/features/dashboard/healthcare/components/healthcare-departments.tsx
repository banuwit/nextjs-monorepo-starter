import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { healthcareDepartments } from "@/mocks/dashboard-healthcare.mock";

import { occupancyPercent, occupancyTone } from "../utils/healthcare";

const barTone = {
  success: "bg-chart-1",
  warning: "bg-amber-500",
  danger: "bg-destructive",
  info: "bg-chart-2",
  neutral: "bg-muted-foreground",
} as const;

export function HealthcareDepartments() {
  const waiting = healthcareDepartments.reduce(
    (sum, department) => sum + department.waiting,
    0,
  );

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Departments</CardTitle>
        <CardDescription>
          Rooms in use, {waiting} patients waiting across the clinic
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {healthcareDepartments.map((department) => {
            const percent = occupancyPercent(
              department.occupied,
              department.capacity,
            );
            const tone = occupancyTone(percent);
            return (
              <li key={department.id} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-medium">
                    {department.name}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    <span
                      className={cn(
                        "font-semibold text-foreground",
                        tone === "danger" && "text-destructive",
                      )}
                    >
                      {department.occupied}
                    </span>
                    {" of "}
                    {department.capacity}
                  </span>
                </div>
                <div
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  aria-label={`${department.name} occupancy`}
                  className="h-2 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className={cn("h-full rounded-full", barTone[tone])}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {percent}% in use, {department.waiting} waiting
                </p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
