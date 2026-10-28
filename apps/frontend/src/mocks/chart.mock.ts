// Presentational sample data for the chart documentation pages.

export const monthlyVisitors = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 264, mobile: 140 },
];

export const revenueComparison = {
  week: [
    { label: "Mon", current: 4.2, previous: 3.8 },
    { label: "Tue", current: 5.1, previous: 4.4 },
    { label: "Wed", current: 4.8, previous: 4.9 },
    { label: "Thu", current: 6.3, previous: 5.2 },
    { label: "Fri", current: 7.1, previous: 5.8 },
    { label: "Sat", current: 5.6, previous: 4.7 },
    { label: "Sun", current: 4.9, previous: 4.1 },
  ],
  month: [
    { label: "W1", current: 28.4, previous: 25.1 },
    { label: "W2", current: 31.2, previous: 27.9 },
    { label: "W3", current: 29.8, previous: 30.4 },
    { label: "W4", current: 35.6, previous: 29.2 },
  ],
  year: [
    { label: "Q1", current: 342, previous: 298 },
    { label: "Q2", current: 389, previous: 331 },
    { label: "Q3", current: 412, previous: 365 },
    { label: "Q4", current: 458, previous: 402 },
  ],
};

export const trafficChannels = [
  { channel: "Organic", visitors: 4280 },
  { channel: "Direct", visitors: 3120 },
  { channel: "Referral", visitors: 1840 },
  { channel: "Social", visitors: 1260 },
  { channel: "Email", visitors: 890 },
];

export const salesVsGoal = [
  { month: "Jan", sales: 42, goal: 40 },
  { month: "Feb", sales: 38, goal: 42 },
  { month: "Mar", sales: 51, goal: 45 },
  { month: "Apr", sales: 47, goal: 48 },
  { month: "May", sales: 56, goal: 50 },
  { month: "Jun", sales: 61, goal: 54 },
];

export const cashflow = [
  { month: "Jan", inflow: 48, outflow: -32, net: 16 },
  { month: "Feb", inflow: 52, outflow: -41, net: 11 },
  { month: "Mar", inflow: 45, outflow: -49, net: -4 },
  { month: "Apr", inflow: 61, outflow: -38, net: 23 },
  { month: "May", inflow: 58, outflow: -44, net: 14 },
  { month: "Jun", inflow: 66, outflow: -40, net: 26 },
];

export const apiMetrics = [
  { day: "Mon", requests: 12400, latency: 182, errors: 0.42 },
  { day: "Tue", requests: 13800, latency: 175, errors: 0.38 },
  { day: "Wed", requests: 15200, latency: 214, errors: 0.81 },
  { day: "Thu", requests: 14100, latency: 196, errors: 0.55 },
  { day: "Fri", requests: 16900, latency: 228, errors: 0.97 },
  { day: "Sat", requests: 9800, latency: 161, errors: 0.29 },
  { day: "Sun", requests: 8700, latency: 154, errors: 0.24 },
];

export const uptimeSeries = [
  { day: "01", uptime: 99.98 },
  { day: "05", uptime: 99.95 },
  { day: "09", uptime: 99.71 },
  { day: "13", uptime: 99.93 },
  { day: "17", uptime: 99.99 },
  { day: "21", uptime: 99.82 },
  { day: "25", uptime: 99.96 },
  { day: "29", uptime: 99.97 },
];

export const trafficSources = [
  { source: "organic", label: "Organic", visitors: 4280 },
  { source: "direct", label: "Direct", visitors: 3120 },
  { source: "referral", label: "Referral", visitors: 1840 },
  { source: "social", label: "Social", visitors: 1260 },
  { source: "email", label: "Email", visitors: 890 },
];

export const browserShare = [
  { browser: "chrome", label: "Chrome", share: 61 },
  { browser: "safari", label: "Safari", share: 19 },
  { browser: "edge", label: "Edge", share: 9 },
  { browser: "firefox", label: "Firefox", share: 7 },
  { browser: "other", label: "Other", share: 4 },
];

export const skillAssessment = [
  { skill: "Frontend", current: 86, target: 90 },
  { skill: "Backend", current: 72, target: 80 },
  { skill: "DevOps", current: 58, target: 70 },
  { skill: "Testing", current: 64, target: 75 },
  { skill: "Design", current: 70, target: 65 },
  { skill: "Security", current: 52, target: 70 },
];

export const productQuality = [
  { metric: "Performance", score: 92, previous: 84 },
  { metric: "Accessibility", score: 88, previous: 86 },
  { metric: "Best Practices", score: 95, previous: 90 },
  { metric: "SEO", score: 81, previous: 83 },
  { metric: "Reliability", score: 76, previous: 64 },
];

export const storageUsage = { used: 72, total: 100 };

export const errorBudgets = [
  { service: "api", label: "API Gateway", remaining: 84 },
  { service: "auth", label: "Auth", remaining: 63 },
  { service: "billing", label: "Billing", remaining: 41 },
];

export const incomeStatement = {
  nodes: [
    { name: "Subscriptions" },
    { name: "Services" },
    { name: "Revenue" },
    { name: "Gross Profit" },
    { name: "Cost of Revenue" },
    { name: "Operating Profit" },
    { name: "Operating Expenses" },
  ],
  links: [
    { source: 0, target: 2, value: 820 },
    { source: 1, target: 2, value: 280 },
    { source: 2, target: 3, value: 760 },
    { source: 2, target: 4, value: 340 },
    { source: 3, target: 5, value: 310 },
    { source: 3, target: 6, value: 450 },
  ],
};

export const signupFunnel = {
  nodes: [
    { name: "Ads" },
    { name: "Organic" },
    { name: "Referral" },
    { name: "Trial" },
    { name: "Paid" },
    { name: "Churned" },
  ],
  links: [
    { source: 0, target: 3, value: 420 },
    { source: 1, target: 3, value: 610 },
    { source: 2, target: 3, value: 230 },
    { source: 3, target: 4, value: 540 },
    { source: 3, target: 5, value: 720 },
  ],
};

export const dealsByStage = {
  won: [
    { size: 12, probability: 82, value: 24 },
    { size: 28, probability: 91, value: 48 },
    { size: 18, probability: 76, value: 30 },
    { size: 34, probability: 88, value: 62 },
    { size: 22, probability: 95, value: 40 },
    { size: 40, probability: 79, value: 70 },
  ],
  open: [
    { size: 16, probability: 42, value: 22 },
    { size: 24, probability: 55, value: 36 },
    { size: 10, probability: 31, value: 12 },
    { size: 36, probability: 48, value: 58 },
    { size: 20, probability: 63, value: 28 },
    { size: 30, probability: 38, value: 44 },
  ],
};

export const responseTimes = [
  { payload: 1, latency: 120 },
  { payload: 2, latency: 138 },
  { payload: 4, latency: 152 },
  { payload: 6, latency: 171 },
  { payload: 8, latency: 196 },
  { payload: 10, latency: 205 },
  { payload: 12, latency: 238 },
  { payload: 14, latency: 249 },
  { payload: 16, latency: 281 },
  { payload: 18, latency: 296 },
];

export const channelRetention = [
  { period: "Month 1", organic: 68, paid: 54, referral: 72, social: 41 },
  { period: "Month 6", organic: 52, paid: 31, referral: 63, social: 22 },
];

export const serviceRanking = [
  { period: "Q1", search: 1, checkout: 2, catalog: 3, profile: 4 },
  { period: "Q2", search: 2, checkout: 1, catalog: 4, profile: 3 },
];

export const kpiSparklines = [
  {
    key: "revenue",
    label: "Revenue",
    value: "$45.2K",
    change: 12.4,
    points: [18, 22, 19, 27, 25, 31, 29, 36, 34, 42],
  },
  {
    key: "orders",
    label: "Orders",
    value: "1,284",
    change: 6.1,
    points: [40, 38, 45, 43, 48, 46, 52, 50, 55, 58],
  },
  {
    key: "refunds",
    label: "Refunds",
    value: "38",
    change: -8.3,
    points: [12, 14, 11, 13, 10, 9, 11, 8, 9, 7],
  },
  {
    key: "conversion",
    label: "Conversion",
    value: "3.8%",
    change: 1.2,
    points: [3.1, 3.4, 3.2, 3.5, 3.3, 3.6, 3.5, 3.7, 3.6, 3.8],
  },
];

export const serviceSparklines = [
  {
    service: "API Gateway",
    latency: "182 ms",
    points: [180, 176, 190, 185, 210, 195, 182],
  },
  { service: "Auth", latency: "64 ms", points: [70, 66, 68, 62, 65, 63, 64] },
  {
    service: "Billing",
    latency: "241 ms",
    points: [210, 220, 205, 230, 250, 238, 241],
  },
  {
    service: "Search",
    latency: "96 ms",
    points: [120, 112, 104, 101, 99, 97, 96],
  },
];

export const storageByFolder = [
  { name: "Media", size: 4820 },
  { name: "Backups", size: 3610 },
  { name: "Documents", size: 2240 },
  { name: "Logs", size: 1580 },
  { name: "Exports", size: 940 },
  { name: "Archive", size: 620 },
];

export const budgetByDepartment = [
  {
    name: "Engineering",
    children: [
      { name: "Platform", size: 420 },
      { name: "Product", size: 360 },
      { name: "Data", size: 210 },
    ],
  },
  {
    name: "Marketing",
    children: [
      { name: "Ads", size: 280 },
      { name: "Content", size: 140 },
    ],
  },
  {
    name: "Operations",
    children: [
      { name: "Support", size: 190 },
      { name: "Finance", size: 120 },
    ],
  },
];
