import type { SalesOrder } from "@/mocks/dashboard-sales.mock";

export type SalesPeriod =
  "this-month" | "last-month" | "last-30-days" | "year-to-date";

export type SalesChannel = "all" | SalesOrder["channel"];

export type SalesOrderFilter =
  "All" | "Needs action" | "Unfulfilled" | "Unpaid" | "Returns";
