import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatChange } from "../utils/spend";

type SpendChangeBadgeProps = {
  /** Fractional change, e.g. 0.14 for +14%. */
  value: number;
  /** Text after the number, e.g. "vs Oct". */
  suffix?: string;
  className?: string;
};

/** Month-over-month change. Growth in spend is the warning direction, so up is amber. */
export function SpendChangeBadge({
  value,
  suffix,
  className,
}: SpendChangeBadgeProps) {
  const Icon =
    value > 0.005
      ? TrendingUpIcon
      : value < -0.005
        ? TrendingDownIcon
        : MinusIcon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
        value > 0.005
          ? "bg-amber-100/70 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200"
          : value < -0.005
            ? "bg-emerald-100/70 text-emerald-900 dark:bg-emerald-400/15 dark:text-emerald-200"
            : "bg-muted text-muted-foreground",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3" />
      {formatChange(value)}
      {suffix && <span className="font-normal opacity-80">{suffix}</span>}
    </span>
  );
}
