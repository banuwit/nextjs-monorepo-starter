import {
  ArchiveIcon,
  FileEditIcon,
  RadioIcon,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "../types/dashboard";
import type {
  AcademyCourseStatus,
  AcademyFunnelStep,
  AcademyInstructor,
} from "../types/academy";

type Style = { tone: StatusTone; icon: LucideIcon; label: string };

export const courseStatusStyles: Record<AcademyCourseStatus, Style> = {
  live: { tone: "success", icon: RadioIcon, label: "Live" },
  draft: { tone: "warning", icon: FileEditIcon, label: "Draft" },
  archived: { tone: "neutral", icon: ArchiveIcon, label: "Archived" },
};

/** Quiz scores at or above this value count as a pass. */
export const PASSING_SCORE = 70;

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function percent(part: number, total: number) {
  return total ? Math.round((part / total) * 100) : 0;
}

export function formatRating(rating: number) {
  return rating.toFixed(1);
}

/**
 * Enriches each funnel step with its share of the first step (bar width)
 * and the drop-off against the previous step.
 */
export function describeFunnel(steps: readonly AcademyFunnelStep[]) {
  const top = steps[0]?.count ?? 0;
  return steps.map((step, index) => {
    const previous = index === 0 ? step.count : (steps[index - 1]?.count ?? 0);
    const dropOff = previous
      ? Math.max(0, Math.round(((previous - step.count) / previous) * 100))
      : 0;
    return {
      ...step,
      share: percent(step.count, top),
      dropOff,
    };
  });
}

export function rankInstructors(
  instructors: readonly AcademyInstructor[],
  limit = 5,
) {
  return [...instructors]
    .sort((a, b) => b.rating - a.rating || b.courses - a.courses)
    .slice(0, limit);
}
