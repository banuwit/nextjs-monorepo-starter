// Data contoh untuk dashboard Productivity; belum terhubung ke API.

export type ProductivityTask = {
  id: string;
  title: string;
  tag: string;
  time: string;
  done: boolean;
};

export const productivityTasks: ProductivityTask[] = [
  { id: "task-1", title: "Finalize Q4 roadmap", tag: "Work", time: "10:00", done: false },
  { id: "task-2", title: "Review design system updates", tag: "Design", time: "11:30", done: true },
  { id: "task-3", title: "Reply to important emails", tag: "Admin", time: "14:00", done: false },
  { id: "task-4", title: "Plan content for next week", tag: "Content", time: "16:30", done: false },
  { id: "task-5", title: "Prepare weekly team sync notes", tag: "Planning", time: "18:00", done: false },
];

export const productivityTaskTags = ["Work", "Design", "Admin", "Content", "Planning"] as const;

export const productivityProjects = [
  { title: "Q4 Roadmap", status: "In progress", description: "Ship better, ship smarter.", progress: 68, due: "2026-11-06" },
  { title: "Website Redesign", status: "Planning", description: "Clean, modern, and fast.", progress: 42, due: "2026-11-20" },
  { title: "Onboarding", status: "Planning", description: "Trim first-run steps.", progress: 31, due: "2026-11-13" },
] as const;

export const productivityNotes = [
  { title: "Design principles that scale", date: "2026-10-29" },
  { title: "Content ideas for November", date: "2026-10-28" },
  { title: "Lessons from the week", date: "2026-10-24" },
  { title: "Books I'm reading", date: "2026-10-22" },
] as const;

export const productivityGoals = { completed: 4, total: 6 } as const;

/** Focus minutes already logged today before this session. */
export const productivityFocusLoggedMinutes = 80;
