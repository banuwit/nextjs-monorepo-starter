import { VideoIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  academyCourses,
  academyGradingBacklog,
  academyInstructors,
  academySessions,
} from "@/mocks/dashboard-academy.mock";

import type { AcademyCourse } from "../types/academy";
import { percent } from "../utils/academy";

const courses = new Map<string, AcademyCourse>(
  academyCourses.map((course) => [course.id, course]),
);
const instructors = new Map<string, string>(
  academyInstructors.map((instructor) => [instructor.id, instructor.name]),
);

export function AcademyCohortSchedule() {
  const seats = academySessions.reduce(
    (sum, session) => ({
      booked: sum.booked + session.seatsBooked,
      total: sum.total + session.seatsTotal,
    }),
    { booked: 0, total: 0 },
  );

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Live sessions today</CardTitle>
        <CardDescription>
          {academySessions.length} sessions, {seats.booked} of {seats.total}{" "}
          seats booked
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <ol className="flex flex-col">
          {academySessions.map((session) => {
            const course = courses.get(session.courseId);
            const filled = percent(session.seatsBooked, session.seatsTotal);
            return (
              <li
                key={session.id}
                className="grid grid-cols-[3rem_1fr] gap-3 border-l-2 border-border py-2 pl-3"
              >
                <time className="text-sm font-medium tabular-nums">
                  {session.time}
                </time>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                      <VideoIcon
                        className="size-3.5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {course?.title ?? session.courseId}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {course ? instructors.get(course.instructorId) : null} ·{" "}
                      <span className="tabular-nums">
                        {session.seatsBooked} of {session.seatsTotal}
                      </span>{" "}
                      seats
                    </p>
                  </div>
                  <Progress
                    value={filled}
                    aria-label={`${filled}% of seats booked for ${course?.title ?? session.courseId}`}
                    className="w-full max-w-40"
                  />
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-auto flex items-baseline justify-between gap-3 rounded-lg bg-muted/60 p-3 text-sm">
          <span className="font-medium">Assignments awaiting grading</span>
          <span className="font-semibold tabular-nums">
            {academyGradingBacklog}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
