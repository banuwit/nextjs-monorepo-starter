import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const tableViews = [
  "../src/features/dashboard/crm/recent-opportunities.tsx",
  "../src/features/dashboard/main/recent-customers.tsx",
  "../src/features/dashboard/sales/sales-orders.tsx",
  "../src/features/file-manager/components/file-list-view.tsx",
  "../src/features/project/components/project-table.tsx",
  "../src/features/task/components/kanban-table.tsx",
];

test("dashboard tables use the shared table primitive without Data Grid or TanStack Table", async () => {
  for (const view of tableViews) {
    const source = await readFile(new URL(view, import.meta.url), "utf8");

    assert.match(source, /@\/components\/ui\/table/);
    assert.doesNotMatch(source, /@\/components\/data-grid/);
    assert.doesNotMatch(source, /@tanstack\/react-table/);
  }
});
