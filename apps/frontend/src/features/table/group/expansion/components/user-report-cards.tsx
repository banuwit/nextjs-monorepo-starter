"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/mocks/user.mock";

function ReportCard({ user }: { user: User }) {
  return (
    <article
      aria-label={`Profile of ${user.name}`}
      className="min-w-0 rounded-lg border bg-card p-3 text-card-foreground shadow-xs"
    >
      <div className="flex items-start justify-between gap-2">
        <Avatar className="size-9">
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <Badge
          variant={user.status === "active" ? "default" : "secondary"}
          className="capitalize"
        >
          {user.status}
        </Badge>
      </div>
      <h4 className="mt-3 font-medium">{user.name}</h4>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {user.id} · <span className="capitalize">{user.role}</span>
      </p>
      <p className="mt-2 break-all text-sm text-muted-foreground">
        {user.email}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
        <span className="capitalize">{user.gender}</span>
        <span>
          Joined <time dateTime={user.joinDate}>{user.joinDate}</time>
        </span>
      </div>
    </article>
  );
}

export function UserReportCards({
  manager,
  reports,
  id,
}: {
  manager: User;
  reports: User[];
  id: string;
}) {
  return (
    <section
      id={id}
      aria-label={`Direct reports of ${manager.name}`}
      className="sticky left-0 w-[calc(100cqw-2px)] max-w-full space-y-3 p-4"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <h3 className="font-semibold">Direct reports</h3>
        <span className="text-muted-foreground">{reports.length} users</span>
        <Badge variant="outline">
          {reports.filter((user) => user.status === "active").length} active
        </Badge>
      </div>
      <div className="grid gap-3 @md:grid-cols-2 @3xl:grid-cols-3">
        {reports.map((user) => (
          <ReportCard key={user.id} user={user} />
        ))}
      </div>
    </section>
  );
}
