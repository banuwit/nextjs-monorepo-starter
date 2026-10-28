const macKeys: Record<string, string> = { Mod: "⌘", Shift: "⇧", Alt: "⌥" };

export function isMacPlatform() {
  return /Mac|iPhone|iPad/.test(navigator.platform);
}

/** "Mod+Shift+Z" → ["⌘", "⇧", "Z"] on macOS, ["Ctrl", "Shift", "Z"] elsewhere. */
export function formatShortcut(shortcut: string, mac: boolean) {
  return shortcut
    .split("+")
    .map((key) => (mac ? (macKeys[key] ?? key) : key === "Mod" ? "Ctrl" : key));
}

/** Value for `aria-keyshortcuts`, e.g. "Meta+B" or "Control+B". */
export function ariaShortcut(shortcut: string, mac: boolean) {
  return shortcut.replace("Mod", mac ? "Meta" : "Control");
}
