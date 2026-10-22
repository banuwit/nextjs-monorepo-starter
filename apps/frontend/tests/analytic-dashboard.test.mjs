import assert from "node:assert/strict";
import { test } from "node:test";
import {
  analyticsKpis,
  campaignsData,
  pages,
  qualitySeries,
  realtimeData,
  referrersData,
  sourcesData,
} from "../src/mocks/dashboard-analytic.mock.ts";

test("analytics KPI direction and change agree with the sample values", () => {
  assert.equal(analyticsKpis.length, 5);
  for (const kpi of analyticsKpis) {
    const current = Number.parseFloat(kpi.value);
    const previous = Number.parseFloat(kpi.previous);
    const change = Math.abs(((current - previous) / previous) * 100);
    assert.equal(kpi.trend, current >= previous ? "up" : "down", kpi.title);
    assert.ok(
      Math.abs(change - Number.parseFloat(kpi.change)) < 0.1,
      kpi.title,
    );
  }
});

test("overview chart and source tabs have complete sample datasets", () => {
  assert.equal(qualitySeries.length, 84);
  assert.equal(realtimeData.length, 30);
  assert.equal(pages.length, 5);
  for (const rows of [sourcesData, campaignsData, referrersData]) {
    assert.equal(rows.length, 5);
    assert.ok(
      rows.every(
        (row, index) => index === 0 || rows[index - 1].visitors >= row.visitors,
      ),
    );
  }
});
