// Presentational sample data for the status tracker variants. Incidents are
// keyed by "days ago" (0 = today) so the tracker rows stay deterministic.

import type {
  Incident,
  PipelineStage,
  RunRecord,
} from "@/features/chart/status-tracker/types/status-tracker";

/** Fixed "today" so server and client render the same days. */
export const trackerEndDate = "2026-10-27";

export const apiIncidents: Record<number, Incident> = {
  3: { status: "degraded", downtime: 12 },
  11: { status: "outage", downtime: 87 },
  12: { status: "degraded", downtime: 6 },
  27: { status: "degraded", downtime: 25 },
  46: { status: "outage", downtime: 124 },
  58: { status: "degraded", downtime: 12 },
  59: { status: "degraded", downtime: 6 },
  74: { status: "degraded", downtime: 6 },
  88: { status: "outage", downtime: 42 },
};

export const serviceIncidents: {
  service: string;
  label: string;
  incidents: Record<number, Incident>;
}[] = [
  {
    service: "web",
    label: "Web app",
    incidents: {
      6: { status: "degraded", downtime: 25 },
      33: { status: "degraded", downtime: 34 },
    },
  },
  {
    service: "api",
    label: "Public API",
    incidents: {
      2: { status: "degraded", downtime: 18 },
      11: { status: "outage", downtime: 42 },
      41: { status: "degraded", downtime: 12 },
    },
  },
  { service: "auth", label: "Authentication", incidents: {} },
  {
    service: "billing",
    label: "Billing",
    incidents: {
      18: { status: "outage", downtime: 87 },
      19: { status: "degraded", downtime: 18 },
      52: { status: "degraded", downtime: 12 },
      53: { status: "degraded", downtime: 6 },
    },
  },
  {
    service: "storage",
    label: "File storage",
    incidents: { 25: { status: "degraded", downtime: 18 } },
  },
];

export const deployPipeline: PipelineStage[] = [
  { stage: "checkout", label: "Checkout", status: "success", duration: 4 },
  { stage: "install", label: "Install", status: "success", duration: 38 },
  { stage: "test", label: "Test", status: "success", duration: 142 },
  { stage: "build", label: "Build", status: "running", duration: 61 },
  { stage: "deploy", label: "Deploy", status: "pending" },
  { stage: "verify", label: "Verify", status: "pending" },
];

/** Most recent run last. Durations in seconds. */
export const runHistory: RunRecord[] = [
  { id: 1183, status: "success", duration: 312, branch: "main" },
  { id: 1184, status: "success", duration: 298, branch: "main" },
  { id: 1185, status: "failed", duration: 74, branch: "feat/search" },
  { id: 1186, status: "success", duration: 305, branch: "feat/search" },
  { id: 1187, status: "success", duration: 321, branch: "main" },
  { id: 1188, status: "success", duration: 290, branch: "fix/login" },
  { id: 1189, status: "failed", duration: 188, branch: "main" },
  { id: 1190, status: "success", duration: 309, branch: "main" },
  { id: 1191, status: "cancelled", duration: 42, branch: "feat/export" },
  { id: 1192, status: "success", duration: 296, branch: "feat/export" },
  { id: 1193, status: "success", duration: 301, branch: "main" },
  { id: 1194, status: "success", duration: 288, branch: "main" },
  { id: 1195, status: "failed", duration: 96, branch: "chore/deps" },
  { id: 1196, status: "success", duration: 317, branch: "chore/deps" },
  { id: 1197, status: "success", duration: 302, branch: "main" },
  { id: 1198, status: "success", duration: 294, branch: "main" },
  { id: 1199, status: "success", duration: 311, branch: "feat/billing" },
  { id: 1200, status: "running", duration: 128, branch: "main" },
];
