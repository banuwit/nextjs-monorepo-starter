import assert from "node:assert/strict";
import { test } from "node:test";

import { PRIMARY_COLORS, SURFACE_COLORS } from "../src/lib/preferences-config.ts";

// Convert the palette's OKLCH values to sRGB before applying the WCAG ratio.
function rgb(value) {
  if (value.startsWith("#")) {
    const raw = value.slice(1);
    const hex = raw.length === 3 ? [...raw].map((digit) => digit + digit).join("") : raw;
    return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  }
  const [, lightness, chroma, angle] = value.match(/oklch\(([\d.]+)% ([\d.]+) ([\d.]+)\)/);
  const L = Number(lightness) / 100;
  const C = Number(chroma);
  const hue = Number(angle) * Math.PI / 180;
  const a = C * Math.cos(hue);
  const b = C * Math.sin(hue);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const gamma = (linear) => linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((linear) => gamma(Math.max(0, Math.min(1, linear))));
}

function contrast(first, second) {
  const luminance = (color) => color.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

test("every primary choice has readable button and standalone text colors", () => {
  const white = rgb("#ffffff");
  const darkCard = rgb("oklch(20.5% 0 0)");
  for (const [name, colors] of Object.entries(PRIMARY_COLORS)) {
    assert.ok(contrast(rgb(colors.color), rgb(colors.foreground)) >= 4.5, `${name} button`);
    assert.ok(contrast(rgb(colors.textLight), white) >= 4.5, `${name} text on a light card`);
    assert.ok(contrast(rgb(colors.textDark), darkCard) >= 4.5, `${name} text on a dark card`);
  }
});

test("muted text remains readable over each translucent app-body color", () => {
  const white = rgb("#ffffff");
  const muted = rgb("oklch(52% 0 0)");
  for (const [name, color] of Object.entries(SURFACE_COLORS)) {
    const tint = rgb(color.light);
    const background = tint.map((channel, index) => channel * 0.6 + white[index] * 0.4);
    assert.ok(contrast(muted, background) >= 4.5, `${name} app body`);
  }
});
