import type { SalesOrder } from "@/mocks/dashboard-sales.mock";

export type SalesPeriod = "this-month" | "last-month" | "last-30-days" | "year-to-date";
export type SalesChannel = "all" | SalesOrder["channel"];
export type SalesOrderFilter = "All" | "Needs action" | "Unfulfilled" | "Unpaid" | "Returns";

export const orderFilters: SalesOrderFilter[] = [
  "All",
  "Needs action",
  "Unfulfilled",
  "Unpaid",
  "Returns",
];

export function filterSalesOrders(
  orders: SalesOrder[],
  period: SalesPeriod,
  channel: SalesChannel,
  status: SalesOrderFilter,
  now: Date,
) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const thisMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  const lastMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
  const thisYear = new Date(Date.UTC(today.getUTCFullYear(), 0, 1));

  return orders.filter((order) => {
    const placed = new Date(today.getTime() - order.daysAgo * 86_400_000);
    const inPeriod =
      period === "this-month" ? placed >= thisMonth :
      period === "last-month" ? placed >= lastMonth && placed < thisMonth :
      period === "last-30-days" ? order.daysAgo < 30 : placed >= thisYear;
    const inStatus =
      status === "All" ||
      (status === "Needs action" && (order.payment === "Pending" || order.fulfillment === "Unfulfilled")) ||
      (status === "Unfulfilled" && order.fulfillment === "Unfulfilled") ||
      (status === "Unpaid" && order.payment === "Pending") ||
      (status === "Returns" && order.fulfillment === "Returned");

    return inPeriod && (channel === "all" || order.channel === channel) && inStatus;
  });
}
