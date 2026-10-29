import type { DashboardCustomer } from "@/mocks/dashboard-main.mock";

export type BillingSummary = {
  billing: DashboardCustomer["billing"];
  count: number;
  mrr: number;
};

/** Groups customers by billing state with the revenue each state holds. */
export function summarizeBilling(customers: readonly DashboardCustomer[]) {
  const order: DashboardCustomer["billing"][] = ["Overdue", "Pending", "Trial"];
  return order.map((billing): BillingSummary => {
    const rows = customers.filter((customer) => customer.billing === billing);
    return {
      billing,
      count: rows.length,
      mrr: rows.reduce((sum, customer) => sum + customer.mrr, 0),
    };
  });
}

export function customersCsvRows(customers: readonly DashboardCustomer[]) {
  return customers.map((customer) => [
    customer.id,
    customer.name,
    customer.email,
    customer.status,
    customer.billing,
    customer.plan,
    customer.mrr,
    customer.joined,
  ]);
}

export const customersCsvHeader = [
  "ID",
  "Name",
  "Email",
  "Status",
  "Billing",
  "Plan",
  "MRR (USD)",
  "Joined",
] as const;
