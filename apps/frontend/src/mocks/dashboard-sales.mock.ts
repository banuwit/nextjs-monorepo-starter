// Data contoh untuk monitor Sales; belum terhubung ke API.

export const salesDailyTarget = 46_000;
export const salesVisitorsLastHour = 1_284;
export const salesConversionRate = 3.4;

/** Share of a typical day's revenue earned in each hour, 00:00–23:00. */
const hourlyShape = [
  0.8, 0.5, 0.3, 0.2, 0.2, 0.4, 1.1, 2.4, 3.9, 5.2, 6.1, 6.6,
  7.4, 7.0, 6.4, 6.2, 6.0, 6.3, 6.9, 7.2, 6.4, 4.8, 3.1, 1.9,
];
const shapeTotal = hourlyShape.reduce((sum, value) => sum + value, 0);

export const salesYesterdayHourly = hourlyShape.map((value) =>
  Math.round((value / shapeTotal) * 41_800),
);

export const salesTodayHourly = hourlyShape.map((value, hour) =>
  Math.round((value / shapeTotal) * 44_600 * (1 + ((hour % 5) - 2) * 0.05)),
);

/** Orders per hour today; used with revenue to derive order counts. */
export const salesTodayOrdersHourly = salesTodayHourly.map((revenue) =>
  Math.max(0, Math.round(revenue / 132)),
);

export type SalesChannelName = "Online store" | "Marketplace" | "Social" | "Retail";

export const salesChannels: {
  name: SalesChannelName;
  share: number;
  yesterdayShare: number;
}[] = [
  { name: "Online store", share: 0.46, yesterdayShare: 0.43 },
  { name: "Marketplace", share: 0.27, yesterdayShare: 0.29 },
  { name: "Social", share: 0.17, yesterdayShare: 0.14 },
  { name: "Retail", share: 0.1, yesterdayShare: 0.14 },
];

export const salesReps = [
  { name: "Nadia Putri", closed: 9_840, quota: 10_000 },
  { name: "Marcus Lee", closed: 8_120, quota: 10_000 },
  { name: "Sofia Alvarez", closed: 6_930, quota: 9_000 },
  { name: "Raka Pratama", closed: 4_410, quota: 8_000 },
  { name: "Hannah Kim", closed: 3_260, quota: 8_000 },
] as const;

export type SalesAlert = {
  id: string;
  severity: "danger" | "warning" | "info";
  title: string;
  detail: string;
};

export const salesAlerts: SalesAlert[] = [
  {
    id: "stock-tote",
    severity: "danger",
    title: "Everyday Tote is out of stock",
    detail: "14 orders are waiting. Restock or hide the listing.",
  },
  {
    id: "unpaid",
    severity: "warning",
    title: "6 orders unpaid for over 24 hours",
    detail: "Send a payment reminder before they are cancelled.",
  },
  {
    id: "returns",
    severity: "warning",
    title: "Returns for Linen Overshirt doubled",
    detail: "Most cite sizing. Check the size guide.",
  },
  {
    id: "promo",
    severity: "info",
    title: "Weekend promo starts tomorrow",
    detail: "Banner and discount code are scheduled for 00:00.",
  },
];

export type SalesOrder = {
  id: string;
  customer: string;
  product: string;
  items: number;
  total: number;
  channel: SalesChannelName;
  payment: "Paid" | "Pending";
  /** Minutes before page load that the order arrived. */
  minutesAgo: number;
};

export const salesRecentOrders: SalesOrder[] = [
  { id: "14550", customer: "Emma Smith", product: "Linen Overshirt", items: 2, total: 248, channel: "Online store", payment: "Paid", minutesAgo: 1 },
  { id: "14549", customer: "Melody Macy", product: "Ceramic Planter", items: 3, total: 186, channel: "Marketplace", payment: "Paid", minutesAgo: 3 },
  { id: "14548", customer: "Max Smith", product: "Everyday Tote", items: 1, total: 79, channel: "Social", payment: "Pending", minutesAgo: 6 },
  { id: "14547", customer: "Sean Bean", product: "Linen Overshirt", items: 4, total: 512, channel: "Online store", payment: "Paid", minutesAgo: 9 },
  { id: "14546", customer: "Brian Cox", product: "Wool Throw", items: 1, total: 140, channel: "Retail", payment: "Paid", minutesAgo: 12 },
  { id: "14545", customer: "Mikaela Collins", product: "Ceramic Planter", items: 2, total: 124, channel: "Marketplace", payment: "Pending", minutesAgo: 16 },
  { id: "14544", customer: "Francis Mitcham", product: "Canvas Apron", items: 1, total: 58, channel: "Social", payment: "Paid", minutesAgo: 21 },
];

/** Orders the monitor appends one by one to simulate live traffic. */
export const salesIncomingOrders: Omit<SalesOrder, "id" | "minutesAgo">[] = [
  { customer: "Olivia Wild", product: "Wool Throw", items: 2, total: 280, channel: "Online store", payment: "Paid" },
  { customer: "Neil Owen", product: "Canvas Apron", items: 1, total: 58, channel: "Retail", payment: "Paid" },
  { customer: "Dan Wilson", product: "Linen Overshirt", items: 1, total: 124, channel: "Marketplace", payment: "Pending" },
  { customer: "Ayu Lestari", product: "Ceramic Planter", items: 3, total: 186, channel: "Social", payment: "Paid" },
  { customer: "Tom Becker", product: "Everyday Tote", items: 2, total: 158, channel: "Online store", payment: "Paid" },
  { customer: "Lena Hart", product: "Wool Throw", items: 1, total: 140, channel: "Marketplace", payment: "Paid" },
];
