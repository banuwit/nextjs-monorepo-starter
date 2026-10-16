import assert from "node:assert/strict";
import { test } from "node:test";

for (const path of ["/dashboard", "/dashboard/main"]) {
  test(`${path} renders the dashboard preview`, async () => {
    const response = await fetch(`http://localhost:3000${path}`);
    assert.equal(response.status, 200);

    const html = await response.text();
    for (const text of [
      "Total Revenue",
      "New Customers",
      "Active Accounts",
      "Growth Rate",
      "Customer Activity",
      "18,426 Customers",
      "Sarah Parker",
      "Search customers...",
    ]) {
      assert.ok(html.includes(text), `${text} is missing`);
    }
    assert.match(html, /aria-label="Customer activity chart/);
    assert.match(html, /aria-label="Select all customers on this page"/);
  });
}
