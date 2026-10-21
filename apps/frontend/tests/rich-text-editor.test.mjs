import assert from "node:assert/strict";
import { test } from "node:test";

test("Rich Text Editor is available inside Playground", async () => {
  const response = await fetch(
    "http://localhost:3000/playground/rich-text-editor",
  );
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Rich Text Editor/);
});

test("editor links accept web and email addresses and reject unsafe protocols", async () => {
  const { normalizeEditorLink } =
    await import("../src/features/rich-text-editor/editor-model.ts");
  assert.equal(
    normalizeEditorLink(" example.com/docs "),
    "https://example.com/docs",
  );
  assert.equal(
    normalizeEditorLink("https://example.com"),
    "https://example.com/",
  );
  assert.equal(
    normalizeEditorLink("mailto:hello@example.com"),
    "mailto:hello@example.com",
  );
  for (const value of [
    "",
    "javascript:alert(1)",
    "data:text/html,test",
    "file:///tmp/a",
    "not a url",
    "//example.com",
  ]) {
    assert.equal(normalizeEditorLink(value), null);
  }
});

test("document statistics handle blank text and whitespace", async () => {
  const { getDocumentStats } =
    await import("../src/features/rich-text-editor/editor-model.ts");
  assert.deepEqual(getDocumentStats(""), {
    words: 0,
    characters: 0,
    minutes: 0,
  });
  assert.deepEqual(getDocumentStats("One  two\nthree"), {
    words: 3,
    characters: 14,
    minutes: 1,
  });
  assert.equal(getDocumentStats(Array(201).fill("word").join(" ")).minutes, 2);
});

test("stored drafts round-trip formatting and reject malformed documents", async () => {
  const { readDraft } =
    await import("../src/features/rich-text-editor/editor-model.ts");
  const doc = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Hello", marks: [{ type: "bold" }] }],
      },
    ],
  };
  assert.deepEqual(readDraft(JSON.stringify(doc)), doc);
  for (const value of [
    "broken",
    "null",
    "{}",
    '{"type":"doc","content":[{"type":"unknown"}]}',
  ]) {
    assert.throws(() => readDraft(value));
  }
});
