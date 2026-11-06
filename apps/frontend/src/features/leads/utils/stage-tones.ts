import type { StageTone } from "../types/leads";

type ToneClasses = { dot: string; soft: string; bar: string };

/** Full class names so Tailwind can detect them; never build them dynamically. */
export const stageTones: Record<StageTone, ToneClasses> = {
  slate: {
    dot: "bg-slate-400",
    soft: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
    bar: "bg-slate-400",
  },
  sky: {
    dot: "bg-sky-500",
    soft: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
    bar: "bg-sky-500",
  },
  indigo: {
    dot: "bg-indigo-500",
    soft: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300",
    bar: "bg-indigo-500",
  },
  violet: {
    dot: "bg-violet-500",
    soft: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
    bar: "bg-violet-500",
  },
  amber: {
    dot: "bg-amber-500",
    soft: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
    bar: "bg-amber-500",
  },
  orange: {
    dot: "bg-orange-500",
    soft: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300",
    bar: "bg-orange-500",
  },
  teal: {
    dot: "bg-teal-500",
    soft: "bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300",
    bar: "bg-teal-500",
  },
  emerald: {
    dot: "bg-emerald-500",
    soft: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
    bar: "bg-emerald-500",
  },
  rose: {
    dot: "bg-rose-500",
    soft: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
    bar: "bg-rose-500",
  },
};

/** Tones cycled for open stages of a pipeline created in the UI. */
export const openStageTones: StageTone[] = [
  "slate",
  "sky",
  "indigo",
  "violet",
  "amber",
  "orange",
  "teal",
];
