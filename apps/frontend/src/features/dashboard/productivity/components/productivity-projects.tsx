import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { daysBetween, formatShortDate } from "../utils/format";
import { productivityProjects } from "@/mocks/dashboard-productivity.mock";

export function ProductivityProjects({ today }: { today: string }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>Active work and how close each is to done</CardDescription>
        <CardAction>
          <Link href="/dashboard/project" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            All projects
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 md:grid-cols-3">
          {productivityProjects.map((project) => {
            const days = daysBetween(today, project.due);
            return (
              <li key={project.title} className="flex flex-col gap-3 rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{project.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{project.description}</p>
                  </div>
                  <Badge variant="secondary" className="font-normal">
                    {project.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-label={`${project.title} progress`}
                    aria-valuenow={project.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                  </div>
                  <span className="text-xs font-medium tabular-nums">{project.progress}%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  <time dateTime={project.due}>Due {formatShortDate(project.due)}</time>, {days} days left
                </p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
