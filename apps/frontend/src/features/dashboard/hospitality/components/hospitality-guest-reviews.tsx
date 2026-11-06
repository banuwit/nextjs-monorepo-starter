import { MessageCircleReplyIcon, StarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  hospitalityReviewSummary,
  hospitalityReviews,
} from "@/mocks/dashboard-hospitality.mock";

import type { HospitalityReviewSummary } from "../types/hospitality";
import {
  initials,
  reviewChannelTones,
  sharePercent,
} from "../utils/hospitality";
import { StatusBadge } from "./status-badge";

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`${value} out of 5 stars`}
      className={cn("flex items-center gap-0.5", className)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          aria-hidden="true"
          className={cn(
            "size-3.5",
            star <= Math.round(value)
              ? "fill-amber-500 text-amber-500"
              : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}

const starRows = [5, 4, 3, 2, 1] as const;

export function HospitalityGuestReviews() {
  // Widen the `as const` literals so the counts compare as plain numbers.
  const summary: HospitalityReviewSummary = hospitalityReviewSummary;
  const { rating, reviews, needsReply, distribution } = summary;

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>Guest sentiment</CardTitle>
        <CardDescription>
          Public reviews across Google, Booking, and TripAdvisor this month
        </CardDescription>
        <CardAction>
          <StatusBadge
            tone={needsReply ? "warning" : "success"}
            icon={MessageCircleReplyIcon}
          >
            {needsReply} need{needsReply === 1 ? "s" : ""} reply
          </StatusBadge>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-[14rem_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-4xl font-semibold tracking-tight tabular-nums">
              {rating.toFixed(1)}
            </p>
            <Stars value={rating} />
            <p className="text-xs text-muted-foreground">
              {reviews} reviews this month
            </p>
          </div>
          <ol
            className="flex flex-col gap-1.5"
            aria-label="Rating distribution"
          >
            {starRows.map((star, index) => {
              const count = distribution[index] ?? 0;
              const percent = sharePercent(count, reviews);
              return (
                <li key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-5 shrink-0 tabular-nums">{star}★</span>
                  <div
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={reviews}
                    aria-valuenow={count}
                    aria-label={`${star} star reviews: ${count}`}
                    className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className={cn(
                        "h-full rounded-full",
                        star >= 4
                          ? "bg-emerald-500"
                          : star === 3
                            ? "bg-amber-500"
                            : "bg-destructive",
                      )}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-7 shrink-0 text-right text-muted-foreground tabular-nums">
                    {count}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
        <ol className="flex min-w-0 flex-col divide-y">
          {hospitalityReviews.map((review) => (
            <li
              key={review.id}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
              >
                {initials(review.guest)}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-medium">{review.guest}</span>
                  <StatusBadge tone={reviewChannelTones[review.channel]}>
                    {review.channel}
                  </StatusBadge>
                  <Stars value={review.stars} />
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                    {review.when}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {review.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {!review.replied && (
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      Awaiting reply
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
