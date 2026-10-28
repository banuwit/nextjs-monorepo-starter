export type TimelineStatus = "done" | "inProgress" | "blocked" | "planned";

/** A task with ISO dates (`YYYY-MM-DD`); `end` is exclusive. */
export type TimelineTask = {
  name: string;
  start: string;
  end: string;
  team?: string;
  status?: TimelineStatus;
};

/** A milestone drawn as a diamond on a task row. */
export type TimelineMilestone = { label: string; task: string; date: string };

/** A shift in hours of the day (`end` may be 24). */
export type TimelineShift = {
  person: string;
  shift: string;
  start: number;
  end: number;
};

/** A row ready for a ranged Recharts bar: `range` is `[start, end]`. */
export type TimelineRow<T> = T & { range: [number, number] };
