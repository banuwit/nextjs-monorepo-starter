// Presentational sample data for the area chart variant examples.

export const monthlySessions = [
  { month: "Jan", organic: 186, referral: 80, social: 42 },
  { month: "Feb", organic: 305, referral: 200, social: 96 },
  { month: "Mar", organic: 237, referral: 120, social: 74 },
  { month: "Apr", organic: 173, referral: 190, social: 128 },
  { month: "May", organic: 209, referral: 130, social: 101 },
  { month: "Jun", organic: 264, referral: 140, social: 88 },
];

export const monthlySignups = [
  { month: "Jan", signups: 412 },
  { month: "Feb", signups: 538 },
  { month: "Mar", signups: 486 },
  { month: "Apr", signups: 621 },
  { month: "May", signups: 704 },
  { month: "Jun", signups: 668 },
];

export const deploysByEnvironment = [
  { month: "Jan", production: 18, staging: 42 },
  { month: "Feb", production: 22, staging: 51 },
  { month: "Mar", production: 22, staging: 38 },
  { month: "Apr", production: 31, staging: 64 },
  { month: "May", production: 27, staging: 58 },
  { month: "Jun", production: 35, staging: 71 },
];

export const visitorsByPlatform = [
  { month: "Jan", desktop: 1860, mobile: 1240 },
  { month: "Feb", desktop: 3050, mobile: 2010 },
  { month: "Mar", desktop: 2370, mobile: 1820 },
  { month: "Apr", desktop: 1730, mobile: 2190 },
  { month: "May", desktop: 2090, mobile: 2330 },
  { month: "Jun", desktop: 2640, mobile: 2480 },
];

const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_START = Date.UTC(2026, 3, 1);

/** 90 days of deterministic visitor counts, ISO dates (UTC). */
export const dailyVisitors = Array.from({ length: 90 }, (_, index) => {
  const weekly = Math.sin((index / 7) * Math.PI * 2);
  const trend = index * 2;
  return {
    date: new Date(DAILY_START + index * DAY_MS).toISOString().slice(0, 10),
    desktop: Math.round(220 + trend + weekly * 70 + ((index * 37) % 60)),
    mobile: Math.round(160 + trend * 0.8 + weekly * 40 + ((index * 53) % 50)),
  };
});
