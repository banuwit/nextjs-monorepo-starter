// Presentational sample data for the sparkline variants.

export const dailyVolumes = [
  {
    key: "orders",
    label: "Orders / day",
    value: "184",
    points: [120, 142, 131, 156, 149, 170, 162, 178, 171, 184],
  },
  {
    key: "tickets",
    label: "Tickets / day",
    value: "42",
    points: [58, 61, 52, 55, 49, 47, 51, 44, 46, 42],
  },
  {
    key: "signups",
    label: "Signups / day",
    value: "96",
    points: [64, 70, 68, 81, 77, 85, 79, 92, 88, 96],
  },
];

/** 1 = success, -1 = failure; most recent run last. */
export const deployResults = [
  {
    pipeline: "web-app",
    results: [1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1],
  },
  {
    pipeline: "api",
    results: [1, -1, -1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1],
  },
  {
    pipeline: "worker",
    results: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1],
  },
];

export const targetMetrics = [
  {
    key: "uptime",
    label: "Uptime",
    value: "99.94%",
    target: 99.9,
    band: [99.9, 100] as const,
    points: [99.95, 99.97, 99.86, 99.92, 99.98, 99.91, 99.96, 99.94],
  },
  {
    key: "p95",
    label: "p95 latency",
    value: "212 ms",
    target: 250,
    band: [150, 250] as const,
    points: [238, 264, 251, 229, 245, 218, 226, 212],
  },
];

export const priceSeries = [
  {
    key: "acme",
    label: "ACME",
    value: "$148.20",
    points: [132, 138, 129, 141, 145, 139, 152, 147, 143, 150, 146, 148.2],
  },
  {
    key: "globex",
    label: "GLOBEX",
    value: "$61.75",
    points: [72, 70, 74, 68, 66, 69, 63, 65, 60, 58, 62, 61.75],
  },
];

export const productTrends = [
  {
    product: "Starter plan",
    revenue: "$12.4K",
    change: 8.2,
    points: [8, 9, 8.5, 10, 10.4, 11, 11.8, 12.4],
  },
  {
    product: "Pro plan",
    revenue: "$28.9K",
    change: 14.6,
    points: [19, 21, 22, 23.5, 24, 26, 27.3, 28.9],
  },
  {
    product: "Enterprise",
    revenue: "$41.2K",
    change: -3.4,
    points: [45, 44, 46, 43, 42.5, 43, 41.8, 41.2],
  },
  {
    product: "Add-ons",
    revenue: "$5.6K",
    change: 2.1,
    points: [5.1, 5.4, 5.2, 5.5, 5.3, 5.6, 5.4, 5.6],
  },
];
