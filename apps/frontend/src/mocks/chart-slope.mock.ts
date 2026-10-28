/** Mock data for the Slope chart variants. */

export const npsByRegion = [
  { period: "2024", emea: 40, na: 51, latam: 36, apac: 47, mea: 30 },
  { period: "2025", emea: 58, na: 54, latam: 35, apac: 44, mea: 28 },
];

export const conversionByPlan = [
  { period: "Before", free: 2.4, starter: 4.8, pro: 6.2, team: 3.6 },
  { period: "After", free: 3.1, starter: 5.6, pro: 5.1, team: 4.4 },
];

/** Rank per quarter, 1 = most downloads. */
export const frameworkRanking = [
  { period: "Q1", nova: 1, orbit: 2, pulse: 3, relay: 4, vector: 5 },
  { period: "Q2", nova: 2, orbit: 1, pulse: 3, relay: 5, vector: 4 },
  { period: "Q3", nova: 3, orbit: 1, pulse: 2, relay: 5, vector: 4 },
  { period: "Q4", nova: 4, orbit: 2, pulse: 1, relay: 3, vector: 5 },
];

/** Median hours to resolve a ticket, Q1 vs Q2. */
export const resolutionByTeam = [
  { team: "Onboarding", before: 30, after: 16 },
  { team: "Sales", before: 20, after: 22 },
  { team: "Support", before: 18, after: 9 },
  { team: "Billing", before: 12, after: 14 },
  { team: "Security", before: 8, after: 6 },
];

/** Market share by country (%), 2024 → 2025. */
export const shareByCountry = [
  {
    period: "2024",
    us: 31,
    de: 24,
    uk: 19,
    fr: 15,
    jp: 12,
    br: 9,
    ca: 6,
    in: 3,
  },
  {
    period: "2025",
    us: 28,
    de: 25,
    uk: 15,
    fr: 19,
    jp: 9,
    br: 12,
    ca: 3,
    in: 6,
  },
];

export const countryLabels = {
  us: "US",
  de: "Germany",
  uk: "UK",
  fr: "France",
  jp: "Japan",
  br: "Brazil",
  ca: "Canada",
  in: "India",
} as const;
