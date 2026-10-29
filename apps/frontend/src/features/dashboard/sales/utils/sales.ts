import {
  salesTodayHourly,
  salesTodayOrdersHourly,
  salesYesterdayHourly,
} from "@/mocks/dashboard-sales.mock";

import type { SalesMonitorTotals } from "../types/sales";

const sumUntil = (values: readonly number[], hour: number) =>
  values.slice(0, hour).reduce((sum, value) => sum + value, 0) + (values[hour] ?? 0) / 2;

/** Totals so far today and at the same point yesterday (current hour counted as half). */
export function salesTotalsAt(hour: number): SalesMonitorTotals {
  return {
    revenue: Math.round(sumUntil(salesTodayHourly, hour)),
    orders: Math.round(sumUntil(salesTodayOrdersHourly, hour)),
    yesterdayRevenue: Math.round(sumUntil(salesYesterdayHourly, hour)),
    yesterdayOrders: Math.round(sumUntil(salesTodayOrdersHourly, hour) * 0.94),
  };
}

/** Running revenue per hour; today stops at the current hour. */
export function cumulativeSales(hour: number, liveExtra: number) {
  let today = 0;
  let yesterday = 0;
  return salesYesterdayHourly.map((value, index) => {
    yesterday += value;
    const label = `${String(index).padStart(2, "0")}:00`;
    if (index > hour) return { hour: label, yesterday, today: null };
    today += index === hour ? salesTodayHourly[index]! / 2 + liveExtra : salesTodayHourly[index]!;
    return { hour: label, yesterday, today: Math.round(today) };
  });
}

/** Where revenue should be by this hour to hit the target, using yesterday's shape. */
export function expectedByNow(hour: number, target: number) {
  const total = salesYesterdayHourly.reduce((sum, value) => sum + value, 0);
  return (sumUntil(salesYesterdayHourly, hour) / total) * target;
}

export function minutesAgoLabel(at: number, now: number) {
  const minutes = Math.max(0, Math.round((now - at) / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  return `${Math.floor(minutes / 60)} h ago`;
}

export const ordersCsvHeader = [
  "Order",
  "Customer",
  "Product",
  "Items",
  "Channel",
  "Payment",
  "Total (USD)",
] as const;
