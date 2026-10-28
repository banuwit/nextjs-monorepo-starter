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

/** Weekly net user change — positive weeks gain users, negative weeks lose them. */
export const weeklyNetUsers = [
  { week: "W1", net: 420 },
  { week: "W2", net: 310 },
  { week: "W3", net: -180 },
  { week: "W4", net: -360 },
  { week: "W5", net: -120 },
  { week: "W6", net: 240 },
  { week: "W7", net: 510 },
  { week: "W8", net: 380 },
  { week: "W9", net: -90 },
  { week: "W10", net: 260 },
];

/** Hourly sensor readings (°C); `null` marks a missed reading. */
export const sensorReadings = [
  { hour: "00:00", indoor: 21, outdoor: 12 },
  { hour: "02:00", indoor: 20, outdoor: 10 },
  { hour: "04:00", indoor: null, outdoor: 9 },
  { hour: "06:00", indoor: null, outdoor: null },
  { hour: "08:00", indoor: 22, outdoor: null },
  { hour: "10:00", indoor: 23, outdoor: 17 },
  { hour: "12:00", indoor: 24, outdoor: 21 },
  { hour: "14:00", indoor: null, outdoor: 23 },
  { hour: "16:00", indoor: 24, outdoor: null },
  { hour: "18:00", indoor: 23, outdoor: 18 },
  { hour: "20:00", indoor: 22, outdoor: 15 },
  { hour: "22:00", indoor: 21, outdoor: 13 },
];

/** Requests per hour (in K), used to compare curve interpolation types. */
export const hourlyRequests = [
  { hour: "08:00", requests: 12 },
  { hour: "09:00", requests: 28 },
  { hour: "10:00", requests: 22 },
  { hour: "11:00", requests: 41 },
  { hour: "12:00", requests: 18 },
  { hour: "13:00", requests: 24 },
  { hour: "14:00", requests: 46 },
  { hour: "15:00", requests: 39 },
  { hour: "16:00", requests: 30 },
  { hour: "17:00", requests: 52 },
  { hour: "18:00", requests: 33 },
  { hour: "19:00", requests: 20 },
];
