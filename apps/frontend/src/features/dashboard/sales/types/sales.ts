import type { SalesOrder } from "@/mocks/dashboard-sales.mock";

/** An order shown in the live feed, with its arrival time as epoch ms. */
export type SalesFeedOrder = Omit<SalesOrder, "minutesAgo"> & { at: number };

export type SalesMonitorTotals = {
  revenue: number;
  orders: number;
  /** Revenue by the same time yesterday. */
  yesterdayRevenue: number;
  yesterdayOrders: number;
};
