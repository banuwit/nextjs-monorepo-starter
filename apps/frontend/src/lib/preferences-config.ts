const COLOR_OPTIONS = [
  "blue",
  "indigo",
  "violet",
  "emerald",
  "teal",
  "orange",
  "rose",
  "neutral",
] as const;

export const PREFERENCE_OPTIONS = {
  themeMode: ["light", "dark", "system"],
  font: ["geist", "inter", "nunito", "roboto", "dm-sans", "poppins", "raleway"],
  contentLayout: ["centered", "full-width"],
  sidebarStyle: ["sidebar", "inset", "floating", "header", "multi"],
  primaryColor: COLOR_OPTIONS,
  sidebarColor: [...COLOR_OPTIONS, "white", "gray"],
  headerColor: [...COLOR_OPTIONS, "white", "gray"],
  appBodyColor: COLOR_OPTIONS,
  borderRadius: ["none", "small", "medium", "large"],
  scale: ["small", "medium", "large"],
} as const;

export type PreferenceKey = keyof typeof PREFERENCE_OPTIONS;
export type Preferences = {
  [K in PreferenceKey]: (typeof PREFERENCE_OPTIONS)[K][number];
};

export const DEFAULT_THEME_MODE: Preferences["themeMode"] = "light";

export const PRIMARY_COLORS = {
  blue: {
    label: "Blue",
    color: "oklch(54.6% 0.245 262.881)",
    foreground: "#fff",
    textLight: "oklch(48.8% 0.243 264.376)",
    textDark: "oklch(80.9% 0.105 251.813)",
  },
  indigo: {
    label: "Indigo",
    color: "oklch(51.1% 0.262 276.966)",
    foreground: "#fff",
    textLight: "oklch(45.7% 0.24 277.023)",
    textDark: "oklch(78.5% 0.115 274.713)",
  },
  violet: {
    label: "Violet",
    color: "oklch(54.1% 0.281 293.009)",
    foreground: "#fff",
    textLight: "oklch(49.1% 0.27 292.581)",
    textDark: "oklch(81.1% 0.111 293.571)",
  },
  emerald: {
    label: "Emerald",
    color: "oklch(59.6% 0.145 163.225)",
    foreground: "#000",
    textLight: "oklch(50.8% 0.118 165.612)",
    textDark: "oklch(84.5% 0.143 164.978)",
  },
  teal: {
    label: "Teal",
    color: "oklch(60% 0.118 184.704)",
    foreground: "#000",
    textLight: "oklch(51.1% 0.096 186.391)",
    textDark: "oklch(85.5% 0.138 181.071)",
  },
  orange: {
    label: "Orange",
    color: "oklch(64.6% 0.222 41.116)",
    foreground: "#000",
    textLight: "oklch(55.3% 0.195 38.402)",
    textDark: "oklch(83.7% 0.128 66.29)",
  },
  rose: {
    label: "Rose",
    color: "oklch(58.6% 0.253 17.585)",
    foreground: "#fff",
    textLight: "oklch(51.4% 0.222 16.935)",
    textDark: "oklch(81% 0.117 11.638)",
  },
  neutral: {
    label: "Neutral",
    color: "oklch(43.9% 0 0)",
    foreground: "#fff",
    textLight: "oklch(37.1% 0 0)",
    textDark: "oklch(87% 0 0)",
  },
} as const satisfies Record<
  Preferences["primaryColor"],
  {
    label: string;
    color: string;
    foreground: string;
    textLight: string;
    textDark: string;
  }
>;

export const SIDEBAR_COLORS = {
  blue: { label: "Blue", light: "#1e40af" },
  indigo: { label: "Indigo", light: "#3730a3" },
  violet: { label: "Violet", light: "#5b21b6" },
  emerald: { label: "Emerald", light: "#065f46" },
  teal: { label: "Teal", light: "#115e59" },
  orange: { label: "Orange", light: "#9a3412" },
  rose: { label: "Rose", light: "#9f1239" },
  neutral: { label: "Neutral", light: "#262626" },
  white: { label: "White", light: "#ffffff", dark: "#0a0a0a" },
  gray: { label: "Gray", light: "#1f2937" },
} as const;

// Tailwind's 50/950 shades for the app body.
export const SURFACE_COLORS = {
  blue: {
    light: "oklch(97% 0.014 254.604)",
    dark: "oklch(28.2% 0.091 267.935)",
  },
  indigo: {
    light: "oklch(96.2% 0.018 272.314)",
    dark: "oklch(25.7% 0.09 281.288)",
  },
  violet: {
    light: "oklch(96.9% 0.016 293.756)",
    dark: "oklch(28.3% 0.141 291.089)",
  },
  emerald: {
    light: "oklch(97.9% 0.021 166.113)",
    dark: "oklch(26.2% 0.051 172.552)",
  },
  teal: {
    light: "oklch(98.4% 0.014 180.72)",
    dark: "oklch(27.7% 0.046 192.524)",
  },
  orange: {
    light: "oklch(98% 0.016 73.684)",
    dark: "oklch(26.6% 0.079 36.259)",
  },
  rose: {
    light: "oklch(96.9% 0.015 12.422)",
    dark: "oklch(27.1% 0.105 12.094)",
  },
  neutral: {
    light: "oklch(98.5% 0 0)",
    dark: "oklch(14.5% 0 0)",
  },
} as const satisfies Record<
  Preferences["primaryColor"],
  { light: string; dark: string }
>;

export function appBodyLightColor(color: Preferences["appBodyColor"]) {
  return SURFACE_COLORS[color].light;
}

export function preferenceColorStyle(
  key: "primaryColor" | "sidebarColor" | "headerColor" | "appBodyColor",
  color: Preferences["sidebarColor"],
): Record<string, string> {
  if (key === "sidebarColor" || key === "headerColor") {
    const prefix = key === "sidebarColor" ? "sidebar" : "header";
    return {
      [`--app-${prefix}-light`]: SIDEBAR_COLORS[color].light,
      [`--app-${prefix}-dark`]:
        color === "white"
          ? SIDEBAR_COLORS[color].dark
          : SIDEBAR_COLORS[color].light,
    };
  }
  const valid = parsePreference(key, color);
  if (key === "primaryColor") {
    const primary = PRIMARY_COLORS[valid];
    return {
      "--app-primary-light": primary.color,
      "--app-primary-dark": primary.color,
      "--app-primary-foreground": primary.foreground,
      "--app-primary-hover": `color-mix(in oklch, ${primary.color} 90%, ${primary.foreground === "#fff" ? "black" : "white"})`,
      "--app-primary-text-light": primary.textLight,
      "--app-primary-text-dark": primary.textDark,
    };
  }
  return {
    "--app-body-light": appBodyLightColor(valid),
    "--app-body-dark": SURFACE_COLORS[valid].dark,
  };
}

export const PREFERENCES_CONFIG: {
  showPreferences: boolean;
  persistToCookie: boolean;
  defaults: Omit<Preferences, "themeMode">;
} = {
  showPreferences: true,
  // Theme is always saved; colors are never saved. Other preferences follow this flag.
  persistToCookie: false,
  defaults: {
    font: "geist",
    contentLayout: "full-width",
    sidebarStyle: "sidebar",
    primaryColor: "blue",
    sidebarColor: "neutral",
    headerColor: "white",
    appBodyColor: "neutral",
    borderRadius: "medium",
    scale: "medium",
  },
};

const COOKIE_NAMES = {
  themeMode: "app_theme",
  font: "app_font",
  contentLayout: "app_layout",
  sidebarStyle: "app_sidebar",
  primaryColor: null,
  sidebarColor: null,
  headerColor: null,
  appBodyColor: null,
  borderRadius: "app_radius",
  scale: "app_scale",
} as const;

export function parsePreference<K extends PreferenceKey>(
  key: K,
  value: unknown,
): Preferences[K] {
  const options: readonly unknown[] = PREFERENCE_OPTIONS[key];
  const defaults: Preferences = {
    themeMode: DEFAULT_THEME_MODE,
    ...PREFERENCES_CONFIG.defaults,
  };
  return options.includes(value) ? (value as Preferences[K]) : defaults[key];
}

export function readPreferences(
  cookieHeader: string,
  persist = PREFERENCES_CONFIG.persistToCookie,
): Preferences {
  const values: Preferences = {
    themeMode: DEFAULT_THEME_MODE,
    ...PREFERENCES_CONFIG.defaults,
  };

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  function read<K extends PreferenceKey>(key: K) {
    if (!COOKIE_NAMES[key] || (key !== "themeMode" && !persist)) return;
    const cookie = cookies.find((entry) =>
      entry.startsWith(`${COOKIE_NAMES[key]}=`),
    );
    try {
      values[key] = parsePreference(
        key,
        cookie && decodeURIComponent(cookie.slice(cookie.indexOf("=") + 1)),
      );
    } catch {
      // Malformed cookie values fall back independently to the configured default.
    }
  }
  for (const key of Object.keys(COOKIE_NAMES) as PreferenceKey[]) read(key);
  return values;
}

export function preferenceCookie<K extends PreferenceKey>(
  key: K,
  value: Preferences[K],
  persist = PREFERENCES_CONFIG.persistToCookie,
): string | null {
  if (!COOKIE_NAMES[key] || (key !== "themeMode" && !persist)) return null;
  return `${COOKIE_NAMES[key]}=${encodeURIComponent(parsePreference(key, value))}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

// Runs before paint for the system theme and one-time migration from the old toggle.
export function preferencesBootScript(values: Preferences) {
  return `(function () {
    var values = ${JSON.stringify(values).replaceAll("<", "\\u003c")};
    try {
        var hasTheme = document.cookie.split(';').some(function (part) { return part.trim().startsWith('app_theme='); });
        if (!hasTheme) {
          var legacy = localStorage.getItem('theme');
          if (legacy === 'light' || legacy === 'dark') {
            values.themeMode = legacy;
            document.cookie = 'app_theme=' + legacy + '; Max-Age=31536000; Path=/; SameSite=Lax' + (window.location.protocol === 'https:' ? '; Secure' : '');
            localStorage.removeItem('theme');
          }
        }
    } catch {}
    var root = document.documentElement;
    root.setAttribute('data-theme-mode', values.themeMode);
    var dark = values.themeMode === 'dark' || (values.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', dark);
    root.style.colorScheme = dark ? 'dark' : 'light';
  })();`;
}
