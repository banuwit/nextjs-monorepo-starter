import assert from "node:assert/strict";
import test from "node:test";

import {
  PREFERENCES_CONFIG,
  PREFERENCE_OPTIONS,
  SIDEBAR_COLORS,
  parsePreference,
  preferenceColorStyle,
  preferenceCookie,
  readPreferences,
} from "./preferences-config.ts";

test("header color uses the sidebar palette and resets to white", () => {
  assert.deepEqual(
    PREFERENCE_OPTIONS.headerColor,
    PREFERENCE_OPTIONS.sidebarColor,
  );
  assert.equal(PREFERENCES_CONFIG.defaults.headerColor, "white");
  assert.equal(parsePreference("headerColor", "unknown"), "white");
  assert.deepEqual(preferenceColorStyle("headerColor", "rose"), {
    "--app-header-light": SIDEBAR_COLORS.rose.light,
    "--app-header-dark": SIDEBAR_COLORS.rose.light,
  });
  assert.deepEqual(preferenceColorStyle("headerColor", "white"), {
    "--app-header-light": SIDEBAR_COLORS.white.light,
    "--app-header-dark": SIDEBAR_COLORS.white.dark,
  });
});

test("header color is not persisted even when cookie persistence is enabled", () => {
  assert.equal(preferenceCookie("headerColor", "rose", true), null);
  assert.equal(readPreferences("app_header=rose", true).headerColor, "white");
});
