import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { StatusTone } from "../types/dashboard";

const toneClass: Record<StatusTone, string> = {
  success:
    "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning:
    "bg-amber-500/15 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  danger: "bg-destructive/10 text-destructive dark:bg-destructive/20",
  info: "bg-sky-500/10 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  neutral: "bg-muted text-muted-foreground",
};

/** State label: always an icon plus text, so color is never the only cue. */
export function StatusBadge({
  tone,
  icon: Icon,
  children,
  className,
}: {
  tone: StatusTone;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent", toneClass[tone], className)}
    >
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </Badge>
  );
}
