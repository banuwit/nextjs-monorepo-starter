import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { Delta } from "../types/dashboard";

const sentimentClass = {
  good: "text-emerald-700 dark:text-emerald-400",
  bad: "text-destructive",
  neutral: "text-muted-foreground",
} as const;

const directionLabel = {
  up: "Increased by",
  down: "Decreased by",
  flat: "Unchanged at",
} as const;

/**
 * A change value whose color follows its meaning, not its sign: more returns
 * is bad even though the number went up.
 */
export function TrendDelta({
  delta,
  className,
}: {
  delta: Delta;
  className?: string;
}) {
  const Icon =
    delta.direction === "up"
      ? ArrowUpRightIcon
      : delta.direction === "down"
        ? ArrowDownRightIcon
        : MinusIcon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium whitespace-nowrap tabular-nums",
        sentimentClass[delta.sentiment],
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span className="sr-only">{directionLabel[delta.direction]} </span>
      {delta.value.replace(/^[+-]/, "")}
    </span>
  );
}
