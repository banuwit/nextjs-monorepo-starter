// Presentational sample data for the bar chart variant examples.

export const weeklyOrders = [
  { day: "Mon", orders: 124 },
  { day: "Tue", orders: 168 },
  { day: "Wed", orders: 242 },
  { day: "Thu", orders: 191 },
  { day: "Fri", orders: 213 },
  { day: "Sat", orders: 96 },
  { day: "Sun", orders: 74 },
];

export const monthlyNetIncome = [
  { month: "Jan", net: 186 },
  { month: "Feb", net: -92 },
  { month: "Mar", net: 137 },
  { month: "Apr", net: -48 },
  { month: "May", net: 209 },
  { month: "Jun", net: -121 },
  { month: "Jul", net: 164 },
];

export const productRevenue = [
  { product: "Analytics Suite", revenue: 48200 },
  { product: "Team Workspace", revenue: 39600 },
  { product: "API Platform", revenue: 31400 },
  { product: "Mobile SDK", revenue: 22800 },
  { product: "Support Plus", revenue: 14500 },
];

export const browserVisitors = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
];

const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_START = Date.UTC(2026, 3, 1);

/** 90 days of deterministic page views per platform, ISO dates (UTC). */
export const dailyPageViews = Array.from({ length: 90 }, (_, index) => {
  const weekly = Math.sin((index / 7) * Math.PI * 2);
  return {
    date: new Date(DAILY_START + index * DAY_MS).toISOString().slice(0, 10),
    desktop: Math.round(260 + index * 1.5 + weekly * 80 + ((index * 41) % 90)),
    mobile: Math.round(180 + index + weekly * 50 + ((index * 29) % 70)),
  };
});

/** Goal completion per team, in percent of the quarterly target. */
export const teamGoalCompletion = [
  { team: "Sales", completion: 86 },
  { team: "Marketing", completion: 72 },
  { team: "Support", completion: 94 },
  { team: "Product", completion: 58 },
  { team: "Finance", completion: 67 },
];

export const featureAdoption = [
  { feature: "Reports", users: 640 },
  { feature: "Alerts", users: 420 },
  { feature: "Exports", users: 310 },
  { feature: "API", users: 530 },
  { feature: "SSO", users: 220 },
];

/** Two weeks of daily sessions; `week` groups the days on the second axis. */
export const dailySessionsByWeek = [
  { day: "05", week: "Oct 5 – 11", sessions: 412 },
  { day: "06", week: "Oct 5 – 11", sessions: 468 },
  { day: "07", week: "Oct 5 – 11", sessions: 502 },
  { day: "08", week: "Oct 5 – 11", sessions: 489 },
  { day: "09", week: "Oct 5 – 11", sessions: 455 },
  { day: "10", week: "Oct 5 – 11", sessions: 286 },
  { day: "11", week: "Oct 5 – 11", sessions: 241 },
  { day: "12", week: "Oct 12 – 18", sessions: 436 },
  { day: "13", week: "Oct 12 – 18", sessions: 521 },
  { day: "14", week: "Oct 12 – 18", sessions: 548 },
  { day: "15", week: "Oct 12 – 18", sessions: 510 },
  { day: "16", week: "Oct 12 – 18", sessions: 477 },
  { day: "17", week: "Oct 12 – 18", sessions: 302 },
  { day: "18", week: "Oct 12 – 18", sessions: 268 },
];

/** Monthly cash flow in $K: inflows are positive, outflows negative. */
export const monthlyCashFlow = [
  { month: "Jan", sales: 120, services: 48, refunds: -18, costs: -84 },
  { month: "Feb", sales: 96, services: 52, refunds: -24, costs: -78 },
  { month: "Mar", sales: 138, services: 61, refunds: -15, costs: -92 },
  { month: "Apr", sales: 112, services: 44, refunds: -31, costs: -88 },
  { month: "May", sales: 151, services: 66, refunds: -20, costs: -97 },
  { month: "Jun", sales: 127, services: 58, refunds: -26, costs: -90 },
];

/** Daily low/high temperature in °C as a `[min, max]` range. */
export const dailyTemperatureRange = [
  { day: "Mon", range: [22, 31] },
  { day: "Tue", range: [23, 32] },
  { day: "Wed", range: [21, 29] },
  { day: "Thu", range: [20, 27] },
  { day: "Fri", range: [22, 30] },
  { day: "Sat", range: [24, 33] },
  { day: "Sun", range: [23, 31] },
];

/** Monthly order count next to revenue in $K, for two Y axes. */
export const monthlyOrdersRevenue = [
  { month: "Jan", orders: 320, revenue: 18.4 },
  { month: "Feb", orders: 284, revenue: 16.9 },
  { month: "Mar", orders: 362, revenue: 22.1 },
  { month: "Apr", orders: 341, revenue: 24.8 },
  { month: "May", orders: 398, revenue: 27.5 },
  { month: "Jun", orders: 375, revenue: 29.2 },
];
