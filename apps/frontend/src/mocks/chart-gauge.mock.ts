// Presentational sample data for the gauge chart variants.

export const healthScore = {
  value: 72,
  bands: [
    { band: "poor", label: "Poor", from: 0, to: 40 },
    { band: "fair", label: "Fair", from: 40, to: 70 },
    { band: "good", label: "Good", from: 70, to: 100 },
  ],
};

export const apiQuota = { used: 68_400, limit: 100_000 };

export const quarterlySales = {
  actual: 412_000,
  target: 480_000,
  max: 600_000,
};

export const customerSatisfaction = {
  value: 64,
  bands: [
    { band: "low", label: "Detractor", from: 0, to: 35 },
    { band: "mid", label: "Passive", from: 35, to: 70 },
    { band: "high", label: "Promoter", from: 70, to: 100 },
  ],
};

export const serverResources = [
  { resource: "cpu", label: "CPU", value: 64, detail: "8 cores" },
  { resource: "memory", label: "Memory", value: 82, detail: "26 / 32 GB" },
  { resource: "disk", label: "Disk", value: 41, detail: "410 / 1,000 GB" },
  { resource: "network", label: "Network", value: 23, detail: "230 Mb/s" },
];
