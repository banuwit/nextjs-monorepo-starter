// Data contoh untuk dashboard presentasional; belum terhubung ke API.
export const productivitySummary = [
  { title: "Today", value: "4", description: "tasks scheduled" },
  { title: "This Week", value: "68%", description: "progress" },
  { title: "Focus", value: "Deep Work", description: "2 hours remaining" },
];

export const productivityTasks = [
  { title: "Finalize Q2 roadmap", tag: "Work", time: "10:00 AM", checked: false },
  { title: "Review design system updates", tag: "Design", time: "11:30 AM", checked: true },
  { title: "Reply to important emails", tag: "Admin", time: "2:00 PM", checked: false },
  { title: "Plan creator content for this week", tag: "Content", time: "4:30 PM", checked: false },
  { title: "Prepare weekly team sync notes", tag: "Planning", time: "6:00 PM", checked: false },
];

export const productivityProjects = [
  {
    title: "Q2 Roadmap",
    status: "In Progress",
    description: "Ship better, ship smarter.",
    progress: 68,
    due: "Due Oct 24",
  },
  {
    title: "Website Redesign",
    status: "Planning",
    description: "Clean, modern, and fast.",
    progress: 42,
    due: "Due Nov 5",
  },
  {
    title: "Onboarding",
    status: "Planning",
    description: "Trim first-run steps.",
    progress: 31,
    due: "Due Nov 2",
  },
];

export const productivityNotes = [
  { title: "Design principles that scale", date: "Today" },
  { title: "Content ideas – October", date: "Yesterday" },
  { title: "Lessons from the week", date: "Oct 11" },
  { title: "Books I’m Reading", date: "Oct 10" },
];

export const productivityGoals = { completed: 4, total: 6 };
