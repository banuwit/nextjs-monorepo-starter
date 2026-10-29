import Link from "next/link";
import { CalendarDaysIcon, PhoneIcon, UsersIcon, VideoIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { crmMeetings, crmProposalGoal } from "@/mocks/dashboard-crm.mock";

const kindIcons = { internal: UsersIcon, call: PhoneIcon, video: VideoIcon } as const;

export function CrmToday() {
  const progress = Math.round((crmProposalGoal.sent / crmProposalGoal.target) * 100);
  const remaining = crmProposalGoal.target - crmProposalGoal.sent;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Today</CardTitle>
        <CardDescription>{crmMeetings.length} meetings on your calendar</CardDescription>
        <CardAction>
          <Link
            href="/dashboard/calendar"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <CalendarDaysIcon data-icon="inline-start" />
            Calendar
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <ol className="flex flex-col">
          {crmMeetings.map((meeting) => {
            const Icon = kindIcons[meeting.kind];
            return (
              <li
                key={meeting.time}
                className="grid grid-cols-[3rem_1fr] gap-3 border-l-2 border-border py-2 pl-3"
              >
                <time className="text-sm font-medium tabular-nums">{meeting.time}</time>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                    <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    {meeting.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {meeting.account}, {meeting.minutes} min
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-auto flex flex-col gap-2 rounded-lg bg-muted/60 p-3">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium">Proposals this month</span>
            <span className="tabular-nums">
              <span className="font-semibold">{crmProposalGoal.sent}</span>
              <span className="text-muted-foreground"> of {crmProposalGoal.target}</span>
            </span>
          </div>
          <Progress
            value={progress}
            aria-label={`${progress}% of the monthly proposal target sent`}
          />
          <p className="text-xs text-muted-foreground">
            Send {remaining} more to reach this month&apos;s target.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
