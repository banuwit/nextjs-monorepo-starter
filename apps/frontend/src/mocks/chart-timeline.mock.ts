// Presentational sample data for the timeline chart variants. Dates are
// ISO strings with an exclusive `end`; the cards map them to day numbers.

import type {
  TimelineMilestone,
  TimelineShift,
  TimelineTask,
} from "@/features/chart/timeline/types/timeline";

/** Fixed "today" so the server and client render the same marker. */
export const timelineToday = "2026-03-25";

export const projectPlan: TimelineTask[] = [
  { name: "Discovery", start: "2026-03-02", end: "2026-03-09" },
  { name: "Wireframes", start: "2026-03-06", end: "2026-03-16" },
  { name: "Visual design", start: "2026-03-13", end: "2026-03-25" },
  { name: "API contracts", start: "2026-03-16", end: "2026-03-23" },
  { name: "Frontend build", start: "2026-03-23", end: "2026-04-13" },
  { name: "Backend build", start: "2026-03-20", end: "2026-04-10" },
  { name: "QA & fixes", start: "2026-04-08", end: "2026-04-20" },
  { name: "Launch", start: "2026-04-20", end: "2026-04-23" },
];

export const teamPlan: TimelineTask[] = [
  {
    name: "User research",
    team: "design",
    start: "2026-03-02",
    end: "2026-03-11",
  },
  {
    name: "Design system",
    team: "design",
    start: "2026-03-09",
    end: "2026-03-27",
  },
  {
    name: "Auth service",
    team: "backend",
    start: "2026-03-04",
    end: "2026-03-18",
  },
  {
    name: "Billing API",
    team: "backend",
    start: "2026-03-16",
    end: "2026-04-06",
  },
  {
    name: "Dashboard UI",
    team: "frontend",
    start: "2026-03-16",
    end: "2026-04-08",
  },
  {
    name: "Settings UI",
    team: "frontend",
    start: "2026-03-30",
    end: "2026-04-15",
  },
  { name: "Test plan", team: "qa", start: "2026-03-23", end: "2026-03-30" },
  { name: "Regression", team: "qa", start: "2026-04-08", end: "2026-04-20" },
];

export const releasePlan: TimelineTask[] = [
  { name: "Scope", start: "2026-03-02", end: "2026-03-10" },
  { name: "Prototype", start: "2026-03-09", end: "2026-03-20" },
  { name: "Beta build", start: "2026-03-18", end: "2026-04-08" },
  { name: "Beta program", start: "2026-04-01", end: "2026-04-15" },
  { name: "General release", start: "2026-04-13", end: "2026-04-22" },
];

export const releaseMilestones: TimelineMilestone[] = [
  { label: "Scope approved", task: "Scope", date: "2026-03-10" },
  { label: "Prototype review", task: "Prototype", date: "2026-03-20" },
  { label: "Beta ready", task: "Beta build", date: "2026-04-08" },
  { label: "GA", task: "General release", date: "2026-04-22" },
];

export const sprintTasks: TimelineTask[] = [
  {
    name: "Login flow",
    status: "done",
    start: "2026-03-02",
    end: "2026-03-09",
  },
  {
    name: "Profile page",
    status: "done",
    start: "2026-03-05",
    end: "2026-03-16",
  },
  {
    name: "Search index",
    status: "inProgress",
    start: "2026-03-12",
    end: "2026-03-30",
  },
  {
    name: "Payments",
    status: "blocked",
    start: "2026-03-16",
    end: "2026-04-01",
  },
  {
    name: "Notifications",
    status: "inProgress",
    start: "2026-03-19",
    end: "2026-04-03",
  },
  {
    name: "Data export",
    status: "blocked",
    start: "2026-03-23",
    end: "2026-04-06",
  },
  {
    name: "Audit log",
    status: "planned",
    start: "2026-03-30",
    end: "2026-04-13",
  },
];

export const shiftRoster: TimelineShift[] = [
  { person: "Ayu", shift: "early", start: 6, end: 14 },
  { person: "Budi", shift: "early", start: 6, end: 14 },
  { person: "Citra", shift: "day", start: 9, end: 17 },
  { person: "Dimas", shift: "day", start: 8, end: 16.5 },
  { person: "Eka", shift: "mid", start: 11, end: 19 },
  { person: "Fajar", shift: "late", start: 14, end: 22 },
  { person: "Gita", shift: "late", start: 15, end: 23 },
];
