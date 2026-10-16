export const dashboardMainMetrics = [
  { label: "Total Revenue", value: "$1,250.00", change: "+12.5%", description: "Visitors for the last 6 months" },
  { label: "New Customers", value: "1,234", change: "-20%", description: "Acquisition needs attention", negative: true },
  { label: "Active Accounts", value: "45,678", change: "+12.5%", description: "Engagement exceeds targets" },
  { label: "Growth Rate", value: "4.5%", change: "+4.5%", description: "Meets growth projections" },
] as const;

export type DashboardCustomer = {
  id: string;
  name: string;
  email: string;
  status: "Subscribed" | "Inactive" | "Unsubscribed";
  billing: "Paid" | "Pending" | "Overdue" | "Trial";
  plan: "Enterprise" | "Growth" | "Pro" | "Starter";
  joined: string;
};

const names = [
  "Sarah Parker", "Michael Brown", "Linda Chen", "David Lee", "Emily White",
  "Jessica Wong", "Kevin Harris", "Priya Shah", "Daniel Hall", "Ava Mitchell",
  "Noah Carter", "Sophia Turner", "Liam Collins", "Mia Roberts", "Ethan Brooks",
  "Grace Murphy", "Lucas Bennett", "Zoe Kelly", "Ryan Cooper", "Chloe Adams",
];
const statuses = ["Subscribed", "Inactive", "Unsubscribed"] as const;
const billings = ["Paid", "Pending", "Overdue", "Trial"] as const;
const plans = ["Enterprise", "Growth", "Pro", "Starter"] as const;

export const dashboardCustomers: DashboardCustomer[] = names.map((name, index) => ({
  id: String(18425 - index),
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
  status: statuses[index % statuses.length]!,
  billing: billings[index % billings.length]!,
  plan: plans[index % plans.length]!,
  joined: new Date(Date.UTC(2026, 9, 15 - index * 4)).toISOString().slice(0, 10),
}));

export const customerActivity = Array.from({ length: 28 }, (_, index) => ({
  date: new Date(Date.UTC(2026, 6, 25 + index * 3)).toISOString().slice(0, 10),
  newCustomers: Math.round(9200 + Math.sin(index * 1.7) * 2400 + (index % 9 === 0 ? 6100 : 0)),
  activeAccounts: Math.round(6200 + Math.sin(index * 0.7) * 280),
  returningUsers: Math.round(4600 + Math.cos(index * 0.65) * 190),
}));
