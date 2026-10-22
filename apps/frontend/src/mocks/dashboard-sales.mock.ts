export const salesMetrics = [
  { label: "Total Sales", value: "$48,560.00", change: "+15.8%", comparison: "vs last week", icon: "sales" },
  { label: "Total Orders", value: "379", change: "+8.3%", comparison: "vs last week", icon: "orders" },
  { label: "Customer Growth", value: "820", change: "+12.5%", comparison: "vs last month", icon: "customers" },
  { label: "Average Order", value: "$128", change: "-$4.20", comparison: "vs last week", icon: "average" },
  { label: "Return Requests", value: "18", change: "+0.6%", comparison: "vs last month", icon: "returns" },
  { label: "Stock Accuracy", value: "97%", change: "+2.4 pts", comparison: "vs last audit", icon: "stock" },
] as const;

export const revenueHistory = [
  4820, 5150, 5060, 5520, 5990, 6880, 5140, 5360, 5520, 5860, 6120, 6720,
  4920, 4680, 5150, 5360, 5720, 6150, 5480, 5920, 5660, 6180, 6340, 6660,
  5840, 6220, 6480, 6110, 6680, 7230, 6280, 6740, 6960, 7120, 6780, 7240,
  6820, 7240, 7680, 7410, 7920, 7810, 6040, 6420, 6150, 6860, 7080, 7090,
  5860, 6120, 6340, 6080, 6620, 6900, 6520, 6840, 7060, 7420, 7160, 8280,
  6980, 7320, 7640, 7160, 8040, 8620, 6900, 7400, 8100, 8600, 8200, 9360,
];

export const trafficHistory = [
  280, 420, 360, 140, 80, 600, 260, 70, 90, 180, 150, 60,
  430, 110, 260, 120, 90, 40, 75, 0, 15, 35, 60, 95,
];

export const trafficSources = [
  { name: "Meta", visits: "5,640", share: 38, change: "+18%" },
  { name: "Google", visits: "3,740", share: 25, change: "-6%" },
  { name: "Shopify", visits: "2,960", share: 20, change: "+7%" },
  { name: "TikTok", visits: "1,340", share: 10, change: "+9%" },
  { name: "eBay", visits: "1,080", share: 7, change: "-3%" },
] as const;

export const productCategories = [
  { name: "Apparel", share: 44, color: "var(--chart-3)" },
  { name: "Accessories", share: 32, color: "var(--chart-2)" },
  { name: "Home", share: 24, color: "var(--chart-1)" },
] as const;

export const topProducts = [
  { name: "Linen Overshirt", category: "Apparel", share: "31%", sales: "$14,820" },
  { name: "Everyday Tote", category: "Accessories", share: "24%", sales: "$11,460" },
  { name: "Ceramic Planter", category: "Home", share: "18%", sales: "$8,930" },
] as const;

export const customerReviews = [
  { name: "Melody Macy", review: "The linen overshirt arrived faster than expected and the fit was exactly right." },
  { name: "Emma Smith", review: "Everything was packed carefully, and checkout was quick and simple." },
  { name: "Olivia Wild", review: "The everyday tote is sturdy and looks just like the photos." },
];

export type SalesOrder = {
  id: string;
  customer: string;
  items: number;
  payment: "Paid" | "Pending" | "Refunded";
  fulfillment: "Fulfilled" | "Unfulfilled" | "Returned";
  total: number;
  daysAgo: number;
  channel: "Online Store" | "Marketplace" | "Social" | "Retail";
};

const orderSeeds = [
  ["Emma Smith", 2, "Pending", "Unfulfilled", 248, "Online Store"],
  ["Melody Macy", 3, "Paid", "Fulfilled", 1200, "Marketplace"],
  ["Max Smith", 1, "Pending", "Unfulfilled", 79, "Social"],
  ["Sean Bean", 5, "Paid", "Fulfilled", 5500, "Online Store"],
  ["Brian Cox", 2, "Refunded", "Returned", 880, "Retail"],
  ["Mikaela Collins", 4, "Paid", "Fulfilled", 7650, "Marketplace"],
  ["Francis Mitcham", 2, "Pending", "Unfulfilled", 375, "Social"],
  ["Olivia Wild", 3, "Paid", "Fulfilled", 38, "Online Store"],
  ["Neil Owen", 1, "Paid", "Unfulfilled", 76, "Retail"],
  ["Dan Wilson", 2, "Refunded", "Returned", 204, "Marketplace"],
] as const;

export const salesOrders: SalesOrder[] = Array.from({ length: 34 }, (_, index) => {
  const seed = orderSeeds[index % orderSeeds.length]!;
  return {
    id: String(14550 - index * 14),
    customer: seed[0],
    items: seed[1],
    payment: seed[2],
    fulfillment: seed[3],
    total: seed[4],
    daysAgo: index < 24 ? Math.floor(index / 2) : 32 + index - 24,
    channel: seed[5],
  };
});
