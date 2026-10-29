// Data contoh untuk dashboard Main; belum terhubung ke API.
import type { KpiItem } from "@/features/dashboard/types/dashboard";

export const dashboardMainMetrics = [
  {
    label: "Monthly revenue",
    value: "$84,250",
    delta: { value: "+12.5%", direction: "up", sentiment: "good" },
    context: "vs September",
    trend: [61, 63, 62, 66, 68, 67, 71, 73, 72, 76, 79, 84],
  },
  {
    label: "New customers",
    value: "1,234",
    delta: { value: "-20%", direction: "down", sentiment: "bad" },
    context: "vs September",
    trend: [1710, 1660, 1690, 1580, 1610, 1540, 1490, 1520, 1430, 1390, 1310, 1234],
  },
  {
    label: "Active accounts",
    value: "45,678",
    delta: { value: "+3.1%", direction: "up", sentiment: "good" },
    context: "vs September",
    trend: [41.2, 41.8, 42.1, 42.6, 43.0, 43.3, 43.9, 44.2, 44.6, 44.9, 45.3, 45.7],
  },
  {
    label: "Net revenue retention",
    value: "108%",
    delta: { value: "+2.4 pts", direction: "up", sentiment: "good" },
    context: "vs last year",
    trend: [101, 102, 102, 103, 104, 104, 105, 105, 106, 106, 107, 108],
  },
] as const satisfies readonly KpiItem[];

export type DashboardCustomer = {
  id: string;
  name: string;
  email: string;
  status: "Subscribed" | "Inactive" | "Unsubscribed";
  billing: "Paid" | "Pending" | "Overdue" | "Trial";
  plan: "Enterprise" | "Growth" | "Pro" | "Starter";
  /** Monthly recurring revenue in USD. */
  mrr: number;
  joined: string;
};

const names = [
  "Sarah Parker", "Michael Brown", "Linda Chen", "David Lee", "Emily White",
  "Jessica Wong", "Kevin Harris", "Priya Shah", "Daniel Hall", "Ava Mitchell",
  "Noah Carter", "Sophia Turner", "Liam Collins", "Mia Roberts", "Ethan Brooks",
  "Grace Murphy", "Lucas Bennett", "Zoe Kelly", "Ryan Cooper", "Chloe Adams",
];
const statuses = ["Subscribed", "Subscribed", "Inactive", "Subscribed", "Unsubscribed"] as const;
const billings = ["Paid", "Pending", "Overdue", "Trial", "Paid"] as const;
const plans = ["Enterprise", "Growth", "Pro", "Starter"] as const;
const planPrice = { Enterprise: 1200, Growth: 480, Pro: 160, Starter: 40 } as const;

export const dashboardCustomers: DashboardCustomer[] = names.map((name, index) => {
  const plan = plans[index % plans.length]!;
  const billing = billings[index % billings.length]!;
  return {
    id: String(18425 - index),
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
    status: billing === "Overdue" ? "Subscribed" : statuses[index % statuses.length]!,
    billing,
    plan,
    mrr: billing === "Trial" ? 0 : planPrice[plan],
    joined: new Date(Date.UTC(2026, 9, 15 - index * 4)).toISOString().slice(0, 10),
  };
});

/** Daily product activity sampled every three days, oldest first. */
export const customerActivity = Array.from({ length: 31 }, (_, index) => ({
  date: new Date(Date.UTC(2026, 6, 31 + index * 3)).toISOString().slice(0, 10),
  activeAccounts: Math.round(5600 + index * 22 + Math.sin(index * 0.7) * 260),
  returningUsers: Math.round(3900 + index * 14 + Math.cos(index * 0.65) * 190),
  newCustomers: Math.round(980 - index * 9 + Math.sin(index * 1.7) * 160),
}));
