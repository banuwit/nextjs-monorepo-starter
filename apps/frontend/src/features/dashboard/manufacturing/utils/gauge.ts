const RADIAN = Math.PI / 180;

// Half-circle geometry (pixels) for the Pie-based OEE gauge.
export const ARC = {
  startAngle: 180,
  endAngle: 0,
  cy: 150,
  inner: 86,
  outer: 122,
};

/** Maps a value to an angle on an arc (Recharts angles: 0° = 3 o'clock). */
export function valueToAngle(
  value: number,
  min = 0,
  max = 100,
  startAngle = 180,
  endAngle = 0,
) {
  const ratio = Math.min(Math.max((value - min) / (max - min), 0), 1);
  return startAngle + (endAngle - startAngle) * ratio;
}

/** Point on a circle; y grows downward like SVG. */
export function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) {
  return {
    x: cx + radius * Math.cos(-angle * RADIAN),
    y: cy + radius * Math.sin(-angle * RADIAN),
  };
}
