import assert from "node:assert/strict";
import test from "node:test";

import { filterMenuTree } from "./menu-search-tree.ts";

const navigation = [
  {
    title: "Table",
    url: "#",
    items: [
      { title: "Base", url: "/table/base" },
      {
        title: "Group",
        url: "#",
        items: [
          { title: "Group Expansion", url: "/table/group/expansion" },
          { title: "Group Tree", url: "/table/group/tree" },
        ],
      },
    ],
  },
  { title: "Project", url: "/dashboard/project" },
];

test("keeps sidebar hierarchy and order for an empty search", () => {
  assert.deepEqual(filterMenuTree(navigation, ""), navigation);
});

test("keeps parents for a matching leaf and removes unrelated branches", () => {
  assert.deepEqual(filterMenuTree(navigation, "TREE"), [
    {
      title: "Table",
      url: "#",
      items: [
        {
          title: "Group",
          url: "#",
          items: [{ title: "Group Tree", url: "/table/group/tree" }],
        },
      ],
    },
  ]);
});

test("matching a parent includes its descendants", () => {
  assert.deepEqual(filterMenuTree(navigation, " group "), [
    { ...navigation[0], items: [navigation[0].items[1]] },
  ]);
});

test("ignores placeholder links and reports no matches", () => {
  assert.deepEqual(filterMenuTree(navigation, "missing"), []);
  assert.deepEqual(filterMenuTree([{ title: "Empty", url: "#" }], ""), []);
});
