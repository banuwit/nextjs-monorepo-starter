const RADIAN = Math.PI / 180;

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

/** SVG path for a tapered needle from (cx, cy) toward `angle`. */
export function needlePath(
  cx: number,
  cy: number,
  length: number,
  angle: number,
  baseWidth = 5,
) {
  const tip = polarPoint(cx, cy, length, angle);
  const left = polarPoint(cx, cy, baseWidth, angle + 90);
  const right = polarPoint(cx, cy, baseWidth, angle - 90);
  return `M ${left.x} ${left.y} L ${tip.x} ${tip.y} L ${right.x} ${right.y} Z`;
}

/** Splits 0–100 into `count` equal segments for a segmented gauge. */
export function gaugeSegments(count: number, min = 0, max = 100) {
  const step = (max - min) / count;
  return Array.from({ length: count }, (_, index) => ({
    index,
    from: min + step * index,
    to: min + step * (index + 1),
    value: step,
  }));
}

export function percentOf(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}
