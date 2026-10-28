// Presentational sample data for the composed chart variants.

export const funnelTrend = [
  { month: "Jan", sessions: 420, signups: 180, activations: 96 },
  { month: "Feb", sessions: 460, signups: 205, activations: 112 },
  { month: "Mar", sessions: 445, signups: 190, activations: 104 },
  { month: "Apr", sessions: 510, signups: 236, activations: 131 },
  { month: "May", sessions: 548, signups: 251, activations: 142 },
  { month: "Jun", sessions: 590, signups: 274, activations: 160 },
];

export const regionSales = [
  { region: "NA", sales: 128, target: 120 },
  { region: "EMEA", sales: 96, target: 105 },
  { region: "APAC", sales: 84, target: 80 },
  { region: "LATAM", sales: 42, target: 50 },
  { region: "ANZ", sales: 31, target: 28 },
];

export const revenueConversion = [
  { month: "Jan", revenue: 42, conversion: 2.8 },
  { month: "Feb", revenue: 48, conversion: 3.1 },
  { month: "Mar", revenue: 45, conversion: 2.9 },
  { month: "Apr", revenue: 57, conversion: 3.4 },
  { month: "May", revenue: 63, conversion: 3.7 },
  { month: "Jun", revenue: 71, conversion: 3.9 },
];

export const latencyRange = [
  { day: "Mon", range: [82, 214], average: 128 },
  { day: "Tue", range: [78, 196], average: 121 },
  { day: "Wed", range: [91, 248], average: 142 },
  { day: "Thu", range: [86, 231], average: 136 },
  { day: "Fri", range: [95, 262], average: 151 },
  { day: "Sat", range: [70, 168], average: 104 },
  { day: "Sun", range: [68, 152], average: 98 },
];

/** Fulfillment time in hours; the target band is 24–36 h. */
export const fulfillmentTarget = {
  min: 24,
  max: 36,
  data: [
    { week: "W1", hours: 41, average: 41 },
    { week: "W2", hours: 38, average: 39.5 },
    { week: "W3", hours: 34, average: 37.7 },
    { week: "W4", hours: 30, average: 34 },
    { week: "W5", hours: 32, average: 32 },
    { week: "W6", hours: 27, average: 29.7 },
    { week: "W7", hours: 29, average: 29.3 },
    { week: "W8", hours: 25, average: 27 },
  ],
};
