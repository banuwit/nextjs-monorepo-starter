/** Mock data for the Treemap chart variants. */

/** Bundle size per package (KB). */
export const bundleByPackage = [
  { name: "react-dom", size: 132 },
  { name: "recharts", size: 96 },
  { name: "date-fns", size: 64 },
  { name: "zod", size: 48 },
  { name: "lucide", size: 36 },
  { name: "base-ui", size: 30 },
  { name: "clsx", size: 12 },
  { name: "nanoid", size: 8 },
];

/** Monthly cloud spend by service ($). */
export const cloudSpend = [
  { name: "Compute", size: 18400 },
  { name: "Database", size: 9600 },
  { name: "Storage", size: 6200 },
  { name: "Network", size: 4100 },
  { name: "Monitoring", size: 2300 },
  { name: "Other", size: 1400 },
];

/** Headcount by region, nested by country. */
export const headcountByRegion = [
  {
    name: "Europe",
    children: [
      { name: "Germany", size: 120 },
      { name: "UK", size: 95 },
      { name: "France", size: 80 },
      { name: "Spain", size: 40 },
    ],
  },
  {
    name: "North America",
    children: [
      { name: "United States", size: 210 },
      { name: "Canada", size: 60 },
      { name: "Mexico", size: 35 },
    ],
  },
  {
    name: "Asia Pacific",
    children: [
      { name: "India", size: 140 },
      { name: "Japan", size: 70 },
      { name: "Australia", size: 45 },
      { name: "Singapore", size: 30 },
    ],
  },
];

/** Open issues by label. */
export const issuesByLabel = [
  { name: "Bug", size: 86 },
  { name: "Feature", size: 64 },
  { name: "Docs", size: 38 },
  { name: "Design", size: 30 },
  { name: "Infra", size: 22 },
  { name: "Question", size: 14 },
];
