import assert from "node:assert/strict";
import { test } from "node:test";
import {
  noteSchema,
  getOutline,
  filterPeople,
} from "../src/features/notes/notes-model.ts";

test("notes drafts retain formatting and reject invalid stored documents", () => {
  const draft = {
    title: "Notes",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello", marks: [{ type: "bold" }] }],
        },
      ],
    },
  };
  assert.deepEqual(noteSchema.parse(draft), draft);
  for (const value of [
    null,
    {},
    { ...draft, title: "" },
    { ...draft, content: "<script>" },
    { ...draft, content: { type: "paragraph" } },
    {
      ...draft,
      content: { type: "doc", content: [{ type: "text", text: 42 }] },
    },
  ]) {
    assert.equal(noteSchema.safeParse(value).success, false);
  }
});

test("live outline follows heading order, levels and edited text", () => {
  const document = {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Playbook" }],
      },
      { type: "paragraph", content: [{ type: "text", text: "Not a heading" }] },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          { type: "text", text: "When " },
          { type: "text", text: "to escalate", marks: [{ type: "bold" }] },
        ],
      },
    ],
  };
  assert.deepEqual(getOutline(document), [
    { title: "Playbook", level: 1 },
    { title: "When to escalate", level: 2 },
  ]);
  assert.deepEqual(getOutline({ type: "doc", content: [] }), []);
});

test("mention suggestions match names case-insensitively and limit results", () => {
  const people = [
    { id: "1", label: "Daniel Okafor" },
    { id: "2", label: "Sofia Chen" },
  ];
  assert.deepEqual(filterPeople(people, "DAN"), [people[0]]);
  assert.deepEqual(filterPeople(people, "missing"), []);
  assert.equal(
    filterPeople(
      Array.from({ length: 12 }, (_, id) => ({
        id: String(id),
        label: "Person",
      })),
      "",
    ).length,
    6,
  );
});
