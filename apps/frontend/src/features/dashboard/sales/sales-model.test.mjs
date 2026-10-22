import assert from "node:assert/strict";
import test from "node:test";

import { filterSalesOrders } from "./sales-model.ts";

const orders = [
  { id: "1", customer: "A", items: 1, payment: "Pending", fulfillment: "Unfulfilled", total: 20, daysAgo: 0, channel: "Social" },
  { id: "2", customer: "B", items: 1, payment: "Paid", fulfillment: "Fulfilled", total: 30, daysAgo: 15, channel: "Retail" },
  { id: "3", customer: "C", items: 1, payment: "Refunded", fulfillment: "Returned", total: 40, daysAgo: 34, channel: "Social" },
];
const now = new Date("2026-10-22T12:00:00Z");

test("period and channel filters narrow the sample orders", () => {
  assert.deepEqual(filterSalesOrders(orders, "this-month", "Social", "All", now).map((order) => order.id), ["1"]);
  assert.deepEqual(filterSalesOrders(orders, "last-month", "all", "All", now).map((order) => order.id), ["3"]);
  assert.deepEqual(filterSalesOrders(orders, "last-30-days", "all", "All", now).map((order) => order.id), ["1", "2"]);
});

test("status filters match payment and fulfillment", () => {
  assert.deepEqual(filterSalesOrders(orders, "year-to-date", "all", "Needs action", now).map((order) => order.id), ["1"]);
  assert.deepEqual(filterSalesOrders(orders, "year-to-date", "all", "Returns", now).map((order) => order.id), ["3"]);
});
