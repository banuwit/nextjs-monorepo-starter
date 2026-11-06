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
  healthcareDoctors,
  healthcareSlotGoal,
} from "@/mocks/dashboard-healthcare.mock";

import { initials } from "../utils/format";
import { doctorStatusStyles } from "../utils/healthcare";
import { StatusBadge } from "./status-badge";

export function HealthcareRoster() {
  const onDuty = healthcareDoctors.filter(
    (doctor) => doctor.status !== "off",
  ).length;
  const progress = Math.round(
    (healthcareSlotGoal.booked / healthcareSlotGoal.capacity) * 100,
  );

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Doctors on duty</CardTitle>
        <CardDescription>
          {onDuty} of {healthcareDoctors.length} on shift today
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <ol className="flex flex-col divide-y">
          {healthcareDoctors.map((doctor) => {
            const style = doctorStatusStyles[doctor.status];
            return (
              <li
                key={doctor.id}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <Avatar size="sm">
                  <AvatarFallback>{initials(doctor.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doctor.name}</p>
                  <p className="truncate text-xs text-muted-foreground tabular-nums">
                    {doctor.department} · {doctor.shift[0]}–{doctor.shift[1]} ·{" "}
                    {doctor.room}
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
            <span className="font-medium">Slots booked today</span>
            <span className="tabular-nums">
              <span className="font-semibold">{healthcareSlotGoal.booked}</span>
              <span className="text-muted-foreground">
                {" "}
                of {healthcareSlotGoal.capacity}
              </span>
            </span>
          </div>
          <Progress
            value={progress}
            aria-label={`${progress}% of today's appointment slots booked`}
          />
          <p className="text-xs text-muted-foreground">
            {healthcareSlotGoal.capacity - healthcareSlotGoal.booked} slots
            still open for walk-ins.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
