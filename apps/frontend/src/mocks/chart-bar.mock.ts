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
