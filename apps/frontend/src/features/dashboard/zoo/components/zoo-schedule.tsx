import { MegaphoneIcon, UtensilsIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { zooFeedingGoal, zooSchedule } from "@/mocks/dashboard-zoo.mock";

import { scheduleStates } from "../utils/zoo";

const kindIcons = { feeding: UtensilsIcon, talk: MegaphoneIcon } as const;

export function ZooSchedule({ hour }: { hour: number }) {
  const states = scheduleStates(zooSchedule, hour);
  const remaining = states.filter((state) => state !== "past").length;
  const progress = Math.round(
    (zooFeedingGoal.done / zooFeedingGoal.total) * 100,
  );

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Feeding & keeper talks</CardTitle>
        <CardDescription>
          {remaining
            ? `${remaining} of ${zooSchedule.length} still to come today`
            : "All sessions for today are done"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <ol className="flex flex-col">
          {zooSchedule.map((item, index) => {
            const Icon = kindIcons[item.kind];
            const state = states[index] ?? "upcoming";
            return (
              <li
                key={item.id}
                aria-current={state === "next" ? "step" : undefined}
                className={cn(
                  "grid grid-cols-[3rem_1fr] gap-3 border-l-2 border-border py-2 pl-3",
                  state === "past" && "text-muted-foreground",
                  state === "next" && "border-primary bg-primary/5",
                )}
              >
                <time className="text-sm font-medium tabular-nums">
                  {item.time}
                </time>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                    <Icon
                      className="size-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.title}</span>
                    {state === "next" && (
                      <span className="ml-auto shrink-0 text-xs font-medium text-primary-text">
                        Next
                      </span>
                    )}
                    {state === "past" && (
                      <span className="sr-only"> (done)</span>
                    )}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.enclosure}, {item.keeper}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-auto flex flex-col gap-2 rounded-lg bg-muted/60 p-3">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium">Feedings done</span>
            <span className="tabular-nums">
              <span className="font-semibold">{zooFeedingGoal.done}</span>
              <span className="text-muted-foreground">
                {" "}
                of {zooFeedingGoal.total}
              </span>
            </span>
          </div>
          <Progress
            value={progress}
            aria-label={`${progress}% of today's feedings done`}
          />
          <p className="text-xs text-muted-foreground">
            {zooFeedingGoal.total - zooFeedingGoal.done} feedings left on the
            daily plan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
