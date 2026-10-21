"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { releases } from "@/mocks/timeline-activity.mock";

// Match the reference's release categories independently of the app accent.
const badgeTones = {
  violet:
    "bg-violet-100/70 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300",
  amber:
    "bg-amber-100/70 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
  emerald:
    "bg-emerald-100/70 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200",
  neutral: "bg-secondary text-secondary-foreground",
};

export function TimelineActivityPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 lg:p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Timeline Activity
        </h1>
        <p className="text-sm text-muted-foreground">
          Product releases and platform updates.
        </p>
      </header>

      <section
        aria-labelledby="release-changelog-title"
        className="mx-auto w-full max-w-2xl py-6 sm:py-12"
      >
        <div className="mb-7 flex flex-col gap-1.5 pl-7 sm:pl-32">
          <h2 id="release-changelog-title" className="text-lg font-semibold">
            Release Changelog
          </h2>
          <p className="text-sm text-muted-foreground">
            Recent releases, fixes, and platform updates.
          </p>
        </div>

        <ol aria-label="Release changelog" className="flex flex-col">
          {releases.map((release, index) => (
            <li
              key={release.id}
              className="group relative grid grid-cols-[0.75rem_minmax(0,1fr)] gap-x-4 pb-8 last:pb-0 sm:grid-cols-[5.5rem_0.75rem_minmax(0,1fr)] sm:gap-x-3.5"
            >
              <time
                dateTime={release.date}
                className="col-start-2 mb-2 text-xs leading-5 text-muted-foreground sm:col-start-1 sm:row-start-1 sm:mb-0 sm:text-right"
              >
                {release.dateLabel}
              </time>
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-3 sm:left-[6.375rem]"
              >
                <span className="absolute top-2 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border group-last:hidden" />
                <span
                  className={cn(
                    "absolute top-1 left-0 size-3 rounded-full border-2 bg-background",
                    index === 0 ? "border-primary" : "border-border",
                  )}
                />
              </div>
              <article
                aria-labelledby={release.id}
                className="col-start-2 flex min-w-0 flex-col gap-1.5 sm:col-start-3 sm:row-start-1"
              >
                <h3 id={release.id} className="text-sm font-medium leading-5">
                  {release.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {release.description}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-sm px-1.5",
                      release.type === "Improved" && badgeTones.violet,
                    )}
                  >
                    {release.type}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-sm px-1.5",
                      release.type === "New" &&
                        "bg-muted/60 text-muted-foreground",
                    )}
                  >
                    {release.impact}
                  </Badge>
                  {release.changes.map((change) => (
                    <Badge
                      key={change.label}
                      variant="secondary"
                      className={cn(
                        "rounded-sm px-1.5",
                        badgeTones[change.tone],
                      )}
                    >
                      {change.label}
                    </Badge>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
        <p className="mt-8 pl-7 text-xs text-muted-foreground sm:pl-32">
          Demo data · Sample release history.
        </p>
      </section>
    </div>
  );
}
