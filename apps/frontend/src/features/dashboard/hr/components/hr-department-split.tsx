import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hrDepartments } from "@/mocks/dashboard-hr.mock";

import { integer } from "../utils/format";
import { sharePercent } from "../utils/hr";

export function HrDepartmentSplit() {
  const total = hrDepartments.reduce(
    (sum, department) => sum + department.headcount,
    0,
  );
  const openRoles = hrDepartments.reduce(
    (sum, department) => sum + department.openRoles,
    0,
  );

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Departments</CardTitle>
        <CardDescription>
          {integer.format(total)} people, {openRoles} open roles across{" "}
          {hrDepartments.length} teams
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {hrDepartments.map((department) => {
            const share = sharePercent(department.headcount, total);
            return (
              <li key={department.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-medium">
                      {department.name}
                    </span>
                    {department.openRoles > 0 && (
                      <Badge
                        variant="outline"
                        className="shrink-0 tabular-nums"
                        aria-label={`${department.openRoles} open roles`}
                      >
                        {department.openRoles} open
                      </Badge>
                    )}
                  </span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {integer.format(department.headcount)}
                    </span>
                    {" · "}
                    {share}%
                  </span>
                </div>
                <div
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={share}
                  aria-label={`${department.name}: ${share}% of headcount`}
                  className="h-2 overflow-hidden rounded-full bg-muted"
                >
                  <div
                    className="h-full rounded-full bg-chart-1"
                    style={{ width: `${share}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
