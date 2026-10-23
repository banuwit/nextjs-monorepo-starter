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

test("header layout is accepted and follows the sidebar style cookie policy", () => {
  assert.equal(parsePreference("sidebarStyle", "header"), "header");
  assert.equal(readPreferences("app_sidebar=header", true).sidebarStyle, "header");
  assert.equal(readPreferences("app_sidebar=header", false).sidebarStyle, "sidebar");
  assert.match(preferenceCookie("sidebarStyle", "header", true), /app_sidebar=header/);
});
