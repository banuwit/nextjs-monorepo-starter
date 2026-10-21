"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

import {
  PREFERENCES_CONFIG,
  parsePreference,
  preferenceCookie,
  preferenceColorStyle,
  type PreferenceKey,
  type Preferences,
} from "@/lib/preferences-config";

const PreferencesContext = createContext<{
  values: Preferences;
  setPreference: <K extends PreferenceKey>(
    key: K,
    value: Preferences[K],
  ) => void;
  resetPreferences: () => void;
} | null>(null);

function applyTheme(mode: Preferences["themeMode"]) {
  const dark =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

function savePreference<K extends PreferenceKey>(
  key: K,
  value: Preferences[K],
) {
  const cookie = preferenceCookie(key, value);
  if (!cookie) return;
  try {
    document.cookie =
      cookie + (location.protocol === "https:" ? "; Secure" : "");
    if (key === "themeMode") localStorage.removeItem("theme");
  } catch {
    // The current choice still works when browser storage is blocked.
  }
}

export function PreferencesProvider({
  children,
  initialValues,
}: {
  children: ReactNode;
  initialValues: Preferences;
}) {
  const [values, update] = useReducer(
    (current: Preferences, patch: Partial<Preferences>) => ({
      ...current,
      ...patch,
    }),
    initialValues,
  );

  useEffect(() => {
    // The boot script may have migrated the legacy theme before hydration.
    update({
      themeMode: parsePreference(
        "themeMode",
        document.documentElement.dataset.themeMode,
      ),
    });
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme(values.themeMode);
    if (values.themeMode === "system")
      media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [values.themeMode]);

  function setPreference<K extends PreferenceKey>(
    key: K,
    value: Preferences[K],
  ) {
    const valid = parsePreference(key, value);
    update({ [key]: valid });
    const root = document.documentElement;
    root.dataset[key] = valid;
    if (key === "themeMode") {
      applyTheme(valid as Preferences["themeMode"]);
    } else if (
      key === "primaryColor" ||
      key === "sidebarColor" ||
      key === "appBodyColor"
    ) {
      for (const [property, color] of Object.entries(
        preferenceColorStyle(key, valid as Preferences["sidebarColor"]),
      ))
        root.style.setProperty(property, color);
    }
    savePreference(key, valid);
  }

  function resetPreferences() {
    for (const key of Object.keys(
      PREFERENCES_CONFIG.defaults,
    ) as (keyof typeof PREFERENCES_CONFIG.defaults)[]) {
      setPreference(key, PREFERENCES_CONFIG.defaults[key]);
    }
  }

  return (
    <PreferencesContext.Provider
      value={{ values, setPreference, resetPreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("PreferencesProvider is required");
  return context;
}
