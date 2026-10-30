import { StarIcon } from "lucide-react";

const STARS = [0, 1, 2, 3, 4];

export function CompareRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="flex" role="img" aria-label={`Rated ${rating} out of 5`}>
        {STARS.map((star) => {
          const fill = Math.min(1, Math.max(0, rating - star)) * 100;
          return (
            <span key={star} className="relative size-3.5">
              <StarIcon className="size-3.5 fill-current text-muted-foreground/30" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill}%` }}
              >
                <StarIcon className="size-3.5 fill-amber-500 text-amber-500" />
              </span>
            </span>
          );
        })}
      </span>
      <span className="tabular-nums">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  );
}
