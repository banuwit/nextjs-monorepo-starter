// Presentational sample data for the scatter chart variants.

/** Sessions per week vs average order value ($) per customer plan. */
export const customerSegments = {
  starter: [
    { sessions: 2, order: 24 },
    { sessions: 3, order: 31 },
    { sessions: 4, order: 28 },
    { sessions: 5, order: 36 },
    { sessions: 3, order: 22 },
    { sessions: 6, order: 40 },
  ],
  pro: [
    { sessions: 6, order: 58 },
    { sessions: 8, order: 66 },
    { sessions: 7, order: 72 },
    { sessions: 9, order: 61 },
    { sessions: 10, order: 80 },
    { sessions: 8, order: 54 },
  ],
  enterprise: [
    { sessions: 11, order: 112 },
    { sessions: 13, order: 128 },
    { sessions: 12, order: 98 },
    { sessions: 15, order: 140 },
    { sessions: 14, order: 121 },
  ],
};

/** Requests (K/day) vs error rate (%) per endpoint; above 2% is a breach. */
export const endpointErrors = {
  threshold: 2,
  data: [
    { requests: 12, errorRate: 0.4 },
    { requests: 18, errorRate: 0.9 },
    { requests: 25, errorRate: 1.2 },
    { requests: 31, errorRate: 2.6 },
    { requests: 38, errorRate: 0.7 },
    { requests: 44, errorRate: 1.6 },
    { requests: 52, errorRate: 3.1 },
    { requests: 58, errorRate: 1.1 },
    { requests: 63, errorRate: 2.2 },
    { requests: 71, errorRate: 0.8 },
    { requests: 78, errorRate: 1.4 },
    { requests: 86, errorRate: 3.6 },
  ],
};

/** Concurrent users vs CPU (%) and memory (GB) for the same nodes. */
export const nodeResources = {
  cpu: [
    { users: 100, cpu: 18 },
    { users: 250, cpu: 29 },
    { users: 400, cpu: 41 },
    { users: 550, cpu: 47 },
    { users: 700, cpu: 62 },
    { users: 850, cpu: 71 },
    { users: 1000, cpu: 84 },
  ],
  memory: [
    { users: 100, memory: 2.1 },
    { users: 250, memory: 2.6 },
    { users: 400, memory: 3.4 },
    { users: 550, memory: 4.1 },
    { users: 700, memory: 4.4 },
    { users: 850, memory: 5.2 },
    { users: 1000, memory: 5.9 },
  ],
};

/** Weekly NPS for two onboarding cohorts. */
export const cohortNps = {
  guided: [
    { week: 1, score: 32 },
    { week: 2, score: 38 },
    { week: 3, score: 41 },
    { week: 4, score: 47 },
    { week: 5, score: 52 },
    { week: 6, score: 55 },
  ],
  selfServe: [
    { week: 1, score: 28 },
    { week: 2, score: 30 },
    { week: 3, score: 27 },
    { week: 4, score: 33 },
    { week: 5, score: 36 },
    { week: 6, score: 35 },
  ],
};

/** Feature adoption (%) vs satisfaction (1–5). */
export const featureMatrix = [
  { name: "Search", usage: 82, satisfaction: 4.4 },
  { name: "Export", usage: 34, satisfaction: 4.1 },
  { name: "Reports", usage: 66, satisfaction: 3.1 },
  { name: "Alerts", usage: 22, satisfaction: 2.8 },
  { name: "Sharing", usage: 58, satisfaction: 4.0 },
  { name: "Import", usage: 41, satisfaction: 2.5 },
  { name: "Billing", usage: 74, satisfaction: 3.5 },
];
