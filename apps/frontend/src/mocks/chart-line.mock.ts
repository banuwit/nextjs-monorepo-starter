// Presentational sample data for the line chart variant examples.

export const monthlyActiveUsers = [
  { month: "Jan", web: 1860, ios: 1120, android: 840 },
  { month: "Feb", web: 2050, ios: 1380, android: 960 },
  { month: "Mar", web: 2370, ios: 1290, android: 1180 },
  { month: "Apr", web: 2130, ios: 1640, android: 1320 },
  { month: "May", web: 2490, ios: 1810, android: 1270 },
  { month: "Jun", web: 2640, ios: 1960, android: 1450 },
];

export const pricingTiers = [
  { month: "Jan", price: 29 },
  { month: "Feb", price: 29 },
  { month: "Mar", price: 35 },
  { month: "Apr", price: 35 },
  { month: "May", price: 32 },
  { month: "Jun", price: 39 },
];

export const conversionRate = [
  { week: "W1", rate: 2.4 },
  { week: "W2", rate: 2.9 },
  { week: "W3", rate: 2.6 },
  { week: "W4", rate: 3.4 },
  { week: "W5", rate: 3.1 },
  { week: "W6", rate: 3.8 },
  { week: "W7", rate: 4.2 },
];

export const npsScores = [
  { quarter: "Q1 '25", score: 32 },
  { quarter: "Q2 '25", score: 38 },
  { quarter: "Q3 '25", score: 35 },
  { quarter: "Q4 '25", score: 44 },
  { quarter: "Q1 '26", score: 51 },
  { quarter: "Q2 '26", score: 48 },
];

export const releaseCommits = [
  { month: "Jan", commits: 142 },
  { month: "Feb", commits: 208 },
  { month: "Mar", commits: 176 },
  { month: "Apr", commits: 254 },
  { month: "May", commits: 231 },
  { month: "Jun", commits: 289 },
];

/** Tickets resolved per month, compared year over year (vertical layout). */
export const ticketsResolved = [
  { month: "Jan", lastYear: 186, thisYear: 214 },
  { month: "Feb", lastYear: 205, thisYear: 238 },
  { month: "Mar", lastYear: 237, thisYear: 229 },
  { month: "Apr", lastYear: 173, thisYear: 262 },
  { month: "May", lastYear: 209, thisYear: 281 },
  { month: "Jun", lastYear: 214, thisYear: 297 },
];

/** Daily p95 latency (ms) per region; `null` marks a day without data. */
export const regionLatency = [
  { day: "Jun 1", eu: 182, us: 164 },
  { day: "Jun 2", eu: 176, us: null },
  { day: "Jun 3", eu: null, us: 171 },
  { day: "Jun 4", eu: null, us: null },
  { day: "Jun 5", eu: 194, us: 158 },
  { day: "Jun 6", eu: 168, us: 149 },
  { day: "Jun 7", eu: 172, us: null },
  { day: "Jun 8", eu: null, us: 162 },
  { day: "Jun 9", eu: 188, us: 170 },
];

/** Monthly growth (%) per product; negative months shrink. */
export const productGrowth = [
  { month: "Jan", core: 4.2, addons: -1.8 },
  { month: "Feb", core: 2.6, addons: -3.4 },
  { month: "Mar", core: -1.4, addons: 1.2 },
  { month: "Apr", core: -2.8, addons: 3.6 },
  { month: "May", core: 1.9, addons: 2.4 },
  { month: "Jun", core: 3.7, addons: -0.6 },
  { month: "Jul", core: 5.1, addons: 1.8 },
  { month: "Aug", core: 2.2, addons: 4.4 },
];
