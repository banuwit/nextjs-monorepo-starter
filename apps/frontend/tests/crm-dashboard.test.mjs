import assert from "node:assert/strict";
import { test } from "node:test";

import {
  filterCrmOpportunities,
  summarizeCrmLeadFlow,
} from "../src/features/dashboard/crm/crm-data.ts";

const opportunities = [
  {
    id: "OP-1",
    account: "Asteron Bioworks",
    stage: "Proposal Sent",
    health: "On Track",
  },
  {
    id: "OP-2",
    account: "BlueHaven Systems",
    stage: "Discovery",
    health: "At Risk",
  },
  {
    id: "OP-3",
    account: "Cinder Health",
    stage: "Discovery",
    health: "On Track",
  },
];

test("search, stage, and health filters compose without changing source opportunities", () => {
  assert.deepEqual(
    filterCrmOpportunities(opportunities, {
      query: "  bluehaven  ",
      stage: "all",
      health: "all",
    }).map((row) => row.id),
    ["OP-2"],
  );
  assert.deepEqual(
    filterCrmOpportunities(opportunities, {
      query: "",
      stage: "Discovery",
      health: "On Track",
    }).map((row) => row.id),
    ["OP-3"],
  );
  assert.deepEqual(
    filterCrmOpportunities(opportunities, {
      query: "missing",
      stage: "all",
      health: "all",
    }),
    [],
  );
  assert.equal(opportunities.length, 3);
});

test("lead summary calculates booking rate and handles empty periods", () => {
  assert.deepEqual(
    summarizeCrmLeadFlow([
      { qualified: 40, booked: 14 },
      { qualified: 60, booked: 21 },
    ]),
    {
      qualified: 100,
      booked: 35,
      bookingRate: 35,
    },
  );
  assert.deepEqual(summarizeCrmLeadFlow([]), {
    qualified: 0,
    booked: 0,
    bookingRate: 0,
  });
});
