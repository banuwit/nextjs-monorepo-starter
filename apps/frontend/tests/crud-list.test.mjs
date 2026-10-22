import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const crudListPath = new URL(
  "../src/components/crud/crud-list.tsx",
  import.meta.url,
);

test("CRUD list uses the shared table primitive with simple pagination", async () => {
  const source = await readFile(crudListPath, "utf8");

  assert.match(source, /@\/components\/ui\/table/);
  assert.match(source, /\.slice\(/);
  assert.match(source, /Halaman sebelumnya/);
  assert.match(source, /Halaman berikutnya/);
  assert.doesNotMatch(source, /@\/components\/data-grid/);
  assert.doesNotMatch(source, /@tanstack\/react-table/);
  assert.doesNotMatch(source, /type="search"/);
});
