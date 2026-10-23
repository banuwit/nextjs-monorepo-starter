import assert from "node:assert/strict";
import test from "node:test";

import { isNavigationItemActive } from "./navigation-active.ts";

const nested = {
  title: "CRUD",
  url: "#",
  items: [{ title: "New Page", url: "/crud/new-page" }],
};

test("nested navigation marks its parent active only for matching routes", () => {
  assert.equal(isNavigationItemActive(nested, "/crud/new-page"), true);
  assert.equal(isNavigationItemActive(nested, "/crud/new-page/123"), true);
  assert.equal(isNavigationItemActive(nested, "/crud/modal"), false);
});

test("dashboard redirect keeps its menu active", () => {
  assert.equal(
    isNavigationItemActive({ title: "Main", url: "/dashboard/main" }, "/dashboard"),
    true,
  );
});
