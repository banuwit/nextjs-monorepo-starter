import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

import {
  PREFERENCES_CONFIG,
  DEFAULT_THEME_MODE,
  readPreferences,
  preferenceCookie,
  preferencesBootScript,
  parsePreference,
} from "../src/lib/preferences-config.ts";

test("centered layout has a visible desktop width limit", () => {
  const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(
    css,
    /\[data-content-layout="centered"\] \[data-slot="app-body"\] \{\s*max-width: 75rem;/,
  );
});

test("inset content clips to its configurable rounded corners", () => {
  const sidebar = readFileSync(
    new URL("../src/components/ui/sidebar.tsx", import.meta.url),
    "utf8",
  );
  assert.match(sidebar, /md:peer-data-\[variant=inset\]:overflow-clip/);
  assert.match(sidebar, /md:peer-data-\[variant=inset\]:rounded-xl/);
});

test("missing or invalid cookies fall back independently to configured defaults", () => {
  assert.deepEqual(readPreferences("", true), {
    themeMode: DEFAULT_THEME_MODE,
    ...PREFERENCES_CONFIG.defaults,
  });
  const values = readPreferences(
    "app_theme=dark; app_font=%ZZ; app_layout=wide; app_sidebar=floating",
    true,
  );
  assert.equal(values.themeMode, "dark");
  assert.equal(values.font, PREFERENCES_CONFIG.defaults.font);
  assert.equal(values.contentLayout, PREFERENCES_CONFIG.defaults.contentLayout);
  assert.equal(values.sidebarStyle, "floating");
});

test("disabled preference persistence ignores layout choices but always restores theme", () => {
  assert.deepEqual(
    readPreferences(
      "app_theme=dark; app_font=inter; app_layout=centered; app_sidebar=inset",
      false,
    ),
    { themeMode: "dark", ...PREFERENCES_CONFIG.defaults },
  );
  assert.equal(preferenceCookie("font", "inter", false), null);
  assert.match(
    preferenceCookie("themeMode", "dark", false),
    /^app_theme=dark;/,
  );
});

test("saving a preference does not freeze unrelated defaults in cookies", () => {
  const cookie = preferenceCookie("themeMode", "dark", true);
  assert.match(cookie, /^app_theme=dark;/);
  assert.match(cookie, /Max-Age=31536000/);
  assert.match(cookie, /Path=\/; SameSite=Lax/);
  assert.doesNotMatch(cookie, /app_font|app_layout|app_sidebar/);
});

function boot({
  persist,
  cookies = "",
  legacyTheme = null,
  systemDark = false,
}) {
  const attributes = new Map();
  const classes = new Set();
  const writes = [];
  let reads = 0;
  const root = {
    setAttribute: (key, value) => attributes.set(key, value),
    classList: {
      toggle: (key, enabled) =>
        enabled ? classes.add(key) : classes.delete(key),
    },
    style: {},
  };
  const document = {
    documentElement: root,
    get cookie() {
      return cookies;
    },
    set cookie(value) {
      writes.push(value);
    },
  };
  vm.runInNewContext(preferencesBootScript(readPreferences(cookies, persist)), {
    document,
    window: {
      matchMedia: () => ({ matches: systemDark }),
      location: { protocol: "https:" },
    },
    localStorage: {
      getItem() {
        reads++;
        return legacyTheme;
      },
      removeItem() {},
    },
  });
  return { attributes, classes, writes, reads };
}

test("first visit applies defaults without writing preference cookies", () => {
  assert.deepEqual(boot({ persist: true }).writes, []);
});

test("theme migration stays enabled when preference persistence is disabled", () => {
  const result = boot({ persist: false, legacyTheme: "dark" });
  assert.equal(result.attributes.get("data-theme-mode"), "dark");
  assert.equal(result.reads, 1);
  assert.equal(result.writes.length, 1);
  assert.match(result.writes[0], /^app_theme=dark;/);
});

test("all seven supported fonts round-trip and removed font choices fall back", () => {
  for (const font of [
    "geist",
    "inter",
    "nunito",
    "roboto",
    "dm-sans",
    "poppins",
    "raleway",
  ]) {
    const cookie = preferenceCookie("font", font, true);
    assert.equal(readPreferences(cookie, true).font, font);
  }
  assert.equal(
    readPreferences("app_font=system", true).font,
    PREFERENCES_CONFIG.defaults.font,
  );
});

test("enabled persistence migrates legacy theme only when no theme cookie exists", () => {
  const migrated = boot({ persist: true, legacyTheme: "dark" });
  assert.equal(migrated.attributes.get("data-theme-mode"), "dark");
  assert.equal(migrated.classes.has("dark"), true);
  assert.match(migrated.writes[0], /^app_theme=dark;/);
  const saved = boot({
    persist: true,
    cookies: "app_theme=light",
    legacyTheme: "dark",
  });
  assert.equal(saved.classes.has("dark"), false);
  assert.deepEqual(saved.writes, []);
});

test("system theme is resolved before hydration", () => {
  assert.equal(
    boot({
      persist: true,
      cookies: "app_theme=system",
      systemDark: true,
    }).classes.has("dark"),
    true,
  );
  assert.equal(
    boot({
      persist: true,
      cookies: "app_theme=system",
      systemDark: false,
    }).classes.has("dark"),
    false,
  );
});

test("colors never write cookies and ignore legacy cookies for either persistence flag", () => {
  for (const persist of [true, false]) {
    for (const [key, value] of [
      ["primaryColor", "rose"],
      ["sidebarColor", "white"],
      ["appBodyColor", "blue"],
    ]) {
      assert.equal(preferenceCookie(key, value, persist), null);
    }
    assert.deepEqual(
      readPreferences(
        "app_primary_color=rose; app_sidebar_color=white; app_body_color=blue; app_theme=dark",
        persist,
      ),
      { themeMode: "dark", ...PREFERENCES_CONFIG.defaults },
    );
    assert.match(
      preferenceCookie("themeMode", "dark", persist),
      /^app_theme=dark;/,
    );
  }
});

test("color exclusions preserve persistence for the other preferences", () => {
  const values = readPreferences(
    "app_font=inter; app_layout=centered; app_sidebar=inset; app_radius=large; app_scale=small; app_body_color=rose",
    true,
  );
  assert.deepEqual(values, {
    ...PREFERENCES_CONFIG.defaults,
    themeMode: DEFAULT_THEME_MODE,
    font: "inter",
    contentLayout: "centered",
    sidebarStyle: "inset",
    borderRadius: "large",
    scale: "small",
  });
  assert.match(preferenceCookie("font", "inter", true), /^app_font=inter;/);
});

test("color choices remain validated for in-memory changes", () => {
  for (const color of [
    "blue",
    "indigo",
    "violet",
    "emerald",
    "teal",
    "orange",
    "rose",
    "neutral",
  ]) {
    for (const key of ["primaryColor", "sidebarColor", "appBodyColor"]) {
      assert.equal(parsePreference(key, color), color);
      assert.equal(
        parsePreference(key, "url(evil)"),
        PREFERENCES_CONFIG.defaults[key],
      );
    }
  }
  for (const color of ["white", "gray"]) {
    assert.equal(parsePreference("sidebarColor", color), color);
    assert.equal(
      parsePreference("primaryColor", color),
      PREFERENCES_CONFIG.defaults.primaryColor,
    );
    assert.equal(
      parsePreference("appBodyColor", color),
      PREFERENCES_CONFIG.defaults.appBodyColor,
    );
  }
});

test("radius restores only supported sizes and follows the persistence flag", () => {
  for (const radius of ["none", "small", "medium", "large"]) {
    assert.equal(
      readPreferences(`app_radius=${radius}`, true).borderRadius,
      radius,
    );
    assert.match(
      preferenceCookie("borderRadius", radius, true),
      new RegExp(`^app_radius=${radius};`),
    );
  }
  assert.equal(preferenceCookie("borderRadius", "large", false), null);
  assert.equal(
    readPreferences("app_radius=large", false).borderRadius,
    PREFERENCES_CONFIG.defaults.borderRadius,
  );
  assert.equal(
    readPreferences("app_radius=999px", true).borderRadius,
    PREFERENCES_CONFIG.defaults.borderRadius,
  );
});

test("scale restores supported sizes and ignores saved values when persistence is disabled", () => {
  for (const scale of ["small", "medium", "large"]) {
    const cookie = preferenceCookie("scale", scale, true);
    assert.match(cookie, new RegExp(`^app_scale=${scale};`));
    assert.equal(readPreferences(cookie, true).scale, scale);
  }
  assert.equal(preferenceCookie("scale", "large", false), null);
  assert.equal(
    readPreferences("app_scale=large", false).scale,
    PREFERENCES_CONFIG.defaults.scale,
  );
  assert.equal(
    readPreferences("app_scale=200%", true).scale,
    PREFERENCES_CONFIG.defaults.scale,
  );
});
