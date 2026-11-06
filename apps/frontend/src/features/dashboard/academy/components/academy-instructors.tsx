import { StarIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { academyInstructors } from "@/mocks/dashboard-academy.mock";

import { formatRating, initials, rankInstructors } from "../utils/academy";

const MAX_RATING = 5;

export function AcademyInstructors() {
  const ranked = rankInstructors(academyInstructors, 5);

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Top instructors</CardTitle>
        <CardDescription>
          Ranked by learner rating across {academyInstructors.length}{" "}
          instructors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col divide-y">
          {ranked.map((instructor, index) => {
            const share = Math.round((instructor.rating / MAX_RATING) * 100);
            return (
              <li
                key={instructor.id}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span className="w-4 shrink-0 text-xs text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <Avatar size="sm">
                  <AvatarFallback>{initials(instructor.name)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-medium">
                      {instructor.name}
                    </p>
                    <span className="flex shrink-0 items-center gap-1 text-sm tabular-nums">
                      <StarIcon
                        className="size-3.5 fill-amber-500 text-amber-500"
                        aria-hidden="true"
                      />
                      {formatRating(instructor.rating)}
                    </span>
                  </div>
                  <div
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={MAX_RATING}
                    aria-valuenow={instructor.rating}
                    aria-label={`${instructor.name} average rating`}
                    className="h-1.5 overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className="h-full rounded-full bg-chart-1"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {instructor.specialty} · {instructor.courses}{" "}
                    {instructor.courses === 1 ? "course" : "courses"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
