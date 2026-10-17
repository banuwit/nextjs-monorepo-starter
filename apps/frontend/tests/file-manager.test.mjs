import assert from "node:assert/strict";
import { test } from "node:test";
import {
  filterFiles,
  toggleFileStar,
  folderNameSchema,
  getFileKind,
  formatFileSize,
  updateFolderSummary,
} from "../src/features/file-manager/file-manager-model.ts";

test("folder summaries track uploaded and removed files", () => {
  const folder = {
    id: "a",
    name: "Folder",
    fileCount: 0,
    size: "0 B",
    sizeBytes: 0,
    updatedAt: "Yesterday",
  };
  const uploaded = updateFolderSummary(folder, 2, 2048);
  assert.equal(uploaded.fileCount, 2);
  assert.equal(uploaded.size, "2 KB");
  assert.equal(updateFolderSummary(uploaded, -1, -1024).size, "1 KB");
  assert.equal(folder.fileCount, 0);
});

const files = [
  {
    id: "a",
    name: "Roadmap.pdf",
    kind: "pdf",
    sizeBytes: 900000,
    modifiedTimestamp: 30,
    starred: true,
    shared: true,
    folderId: "brand",
  },
  {
    id: "b",
    name: "Budget.xlsx",
    kind: "spreadsheet",
    sizeBytes: 2000000,
    modifiedTimestamp: 20,
    starred: false,
    shared: false,
    folderId: "finance",
  },
  {
    id: "c",
    name: "Archive.zip",
    kind: "archive",
    sizeBytes: 10000000,
    modifiedTimestamp: 10,
    starred: true,
    shared: false,
    folderId: "brand",
  },
];

test("search, visibility, file type and folder filters combine", () => {
  assert.deepEqual(
    filterFiles(files, {
      search: " ROAD ",
      show: "shared",
      kind: "pdf",
      folderId: "brand",
    }).map((f) => f.id),
    ["a"],
  );
  assert.deepEqual(
    filterFiles(files, { show: "starred" }).map((f) => f.id),
    ["a", "c"],
  );
  assert.deepEqual(filterFiles(files, { kind: "design" }), []);
  assert.deepEqual(filterFiles(files, { folderId: "missing" }), []);
});

test("sorting uses numeric size and timestamp without mutating input", () => {
  assert.deepEqual(
    filterFiles(files, { sort: "size" }).map((f) => f.id),
    ["c", "b", "a"],
  );
  assert.deepEqual(
    filterFiles(files, { sort: "name" }).map((f) => f.id),
    ["c", "b", "a"],
  );
  assert.deepEqual(
    filterFiles([...files].reverse(), { sort: "modified" }).map((f) => f.id),
    ["a", "b", "c"],
  );
  assert.deepEqual(
    files.map((f) => f.id),
    ["a", "b", "c"],
  );
});

test("star changes feed every view and starred filter without changing other files", () => {
  const updated = toggleFileStar(files, "b");
  assert.equal(updated[1].starred, true);
  assert.equal(files[1].starred, false);
  assert.deepEqual(
    filterFiles(updated, { show: "starred" }).map((f) => f.id),
    ["a", "b", "c"],
  );
  assert.equal(toggleFileStar(updated, "b")[1].starred, false);
});

test("folder names reject blank, path separators and excessive length", () => {
  assert.equal(folderNameSchema.parse("  New folder  "), "New folder");
  for (const name of [" ", "one/two", "one\\two", "x".repeat(101)])
    assert.equal(folderNameSchema.safeParse(name).success, false);
});

test("uploaded files get useful type labels and byte sizes", () => {
  assert.equal(getFileKind("REPORT.PDF"), "pdf");
  assert.equal(getFileKind("data.csv"), "spreadsheet");
  assert.equal(getFileKind("unknown.bin"), "other");
  assert.equal(formatFileSize(0), "0 B");
  assert.equal(formatFileSize(1024), "1 KB");
  assert.equal(formatFileSize(1024 ** 3), "1 GB");
});
