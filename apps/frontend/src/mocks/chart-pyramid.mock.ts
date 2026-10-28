// Presentational sample data for the pyramid chart variants. Values are
// positive; the cards mirror the left side with `mirrorRows`.

/** Population in thousands by age band, youngest first. */
export const populationByAge = [
  { label: "0–9", male: 2140, female: 2045 },
  { label: "10–19", male: 2210, female: 2105 },
  { label: "20–29", male: 2380, female: 2310 },
  { label: "30–39", male: 2290, female: 2265 },
  { label: "40–49", male: 2050, female: 2080 },
  { label: "50–59", male: 1820, female: 1905 },
  { label: "60–69", male: 1410, female: 1560 },
  { label: "70–79", male: 860, female: 1080 },
  { label: "80+", male: 340, female: 590 },
];

/** Support tickets this month by team. */
export const ticketsByTeam = [
  { label: "Billing", inbound: 482, outbound: 356 },
  { label: "Onboarding", inbound: 365, outbound: 410 },
  { label: "Technical", inbound: 618, outbound: 274 },
  { label: "Accounts", inbound: 241, outbound: 198 },
  { label: "Partners", inbound: 132, outbound: 225 },
];

/** Customers by age band, split by plan on each side. */
export const customersByAgePlan = [
  {
    label: "18–24",
    menFree: 820,
    menPaid: 140,
    womenFree: 760,
    womenPaid: 165,
  },
  {
    label: "25–34",
    menFree: 1240,
    menPaid: 520,
    womenFree: 1180,
    womenPaid: 560,
  },
  {
    label: "35–44",
    menFree: 960,
    menPaid: 610,
    womenFree: 1010,
    womenPaid: 640,
  },
  {
    label: "45–54",
    menFree: 620,
    menPaid: 430,
    womenFree: 690,
    womenPaid: 470,
  },
  {
    label: "55–64",
    menFree: 380,
    menPaid: 210,
    womenFree: 420,
    womenPaid: 260,
  },
  { label: "65+", menFree: 190, menPaid: 80, womenFree: 240, womenPaid: 110 },
];

/** Employees by tenure band for two regions. */
export const employeesByTenure = [
  { label: "< 1 yr", emea: 86, americas: 124 },
  { label: "1–2 yrs", emea: 112, americas: 138 },
  { label: "3–5 yrs", emea: 148, americas: 121 },
  { label: "6–10 yrs", emea: 94, americas: 76 },
  { label: "10+ yrs", emea: 41, americas: 33 },
];
