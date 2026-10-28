export type SceneColors = {
  primary: string;
  primaryForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  card: string;
  background: string;
  pitch: string;
  pitchLine: string;
  dark: boolean;
};

export const fallbackSceneColors: SceneColors = {
  primary: "#2563eb",
  primaryForeground: "#ffffff",
  muted: "#f5f5f5",
  mutedForeground: "#737373",
  border: "#e5e5e5",
  card: "#ffffff",
  background: "#fafafa",
  pitch: "#4ea86b",
  pitchLine: "#e8f5ec",
  dark: false,
};

/**
 * Resolve a CSS color token to a hex string three.js can parse.
 * Tokens are declared in oklch(), so the color is painted on a 1×1 canvas
 * and read back as sRGB bytes.
 */
export function resolveCssColor(
  token: string,
  fallback: string,
  /** Opaque color to composite translucent tokens (such as borders) over. */
  base?: string,
) {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  if (!raw) return fallback;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return fallback;
  if (base) {
    context.fillStyle = base;
    context.fillRect(0, 0, 1, 1);
  }
  context.fillStyle = raw;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
  if (a === 0) return fallback;
  return `#${[r, g, b]
    .map((channel) => (channel ?? 0).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function readSceneColors(): SceneColors {
  if (typeof document === "undefined") return fallbackSceneColors;
  const dark = document.documentElement.classList.contains("dark");
  const background = resolveCssColor(
    "--background",
    fallbackSceneColors.background,
  );
  const card = resolveCssColor("--card", fallbackSceneColors.card, background);
  const resolve = (token: string, fallback: string) =>
    resolveCssColor(token, fallback, card);
  return {
    primary: resolve("--primary", fallbackSceneColors.primary),
    primaryForeground: resolve(
      "--primary-foreground",
      fallbackSceneColors.primaryForeground,
    ),
    muted: resolve("--muted", fallbackSceneColors.muted),
    mutedForeground: resolve(
      "--muted-foreground",
      fallbackSceneColors.mutedForeground,
    ),
    border: resolve("--border", fallbackSceneColors.border),
    card,
    background,
    pitch: dark ? "#3f8a58" : "#4ea86b",
    pitchLine: dark ? "#d7ead9" : "#eef7f0",
    dark,
  };
}
