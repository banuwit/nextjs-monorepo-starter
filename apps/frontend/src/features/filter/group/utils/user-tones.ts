import type { Tone } from "@/components/filter/advanced/value-displays";

export const STATUS_TONES: Tone[] = [
  {
    value: "active",
    label: "Active",
    dot: "bg-emerald-500",
    badge:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  {
    value: "pending",
    label: "Pending",
    dot: "bg-amber-500",
    badge:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/15 dark:text-amber-300",
  },
  {
    value: "inactive",
    label: "Inactive",
    dot: "bg-zinc-400",
    badge:
      "border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:border-zinc-400/25 dark:bg-zinc-400/15 dark:text-zinc-300",
  },
];

/** A ramp, cool to hot, so the order reads without the words. */
export const LEVEL_TONES: Tone[] = [
  {
    value: "junior",
    label: "Junior",
    dot: "bg-sky-500",
    badge:
      "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:border-sky-400/25 dark:bg-sky-400/15 dark:text-sky-300",
  },
  {
    value: "mid",
    label: "Mid",
    dot: "bg-teal-500",
    badge:
      "border-teal-500/20 bg-teal-500/10 text-teal-700 dark:border-teal-400/25 dark:bg-teal-400/15 dark:text-teal-300",
  },
  {
    value: "senior",
    label: "Senior",
    dot: "bg-yellow-500",
    badge:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:border-yellow-400/25 dark:bg-yellow-400/15 dark:text-yellow-300",
  },
  {
    value: "lead",
    label: "Lead",
    dot: "bg-orange-500",
    badge:
      "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:border-orange-400/25 dark:bg-orange-400/15 dark:text-orange-300",
  },
  {
    value: "principal",
    label: "Principal",
    dot: "bg-rose-500",
    badge:
      "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:border-rose-400/25 dark:bg-rose-400/15 dark:text-rose-300",
  },
];
