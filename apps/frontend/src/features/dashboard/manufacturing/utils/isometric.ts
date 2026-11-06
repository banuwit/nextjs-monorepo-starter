/**
 * Isometric projection for the floor plan. `x` runs toward the lower right,
 * `y` toward the lower left, `z` straight up. One grid unit is `UNIT` px.
 */
export const UNIT = 24;
const COS30 = Math.cos(Math.PI / 6);

export type IsoPoint = { x: number; y: number };

export function iso(
  x: number,
  y: number,
  z: number,
  origin: IsoPoint,
): IsoPoint {
  return {
    x: origin.x + (x - y) * UNIT * COS30,
    y: origin.y + (x + y) * UNIT * 0.5 - z * UNIT,
  };
}

export function polygon(points: IsoPoint[]) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

/** Three visible faces of a box standing on the floor. */
export function boxFaces(
  x: number,
  y: number,
  w: number,
  d: number,
  h: number,
  origin: IsoPoint,
) {
  const top = [
    iso(x, y, h, origin),
    iso(x + w, y, h, origin),
    iso(x + w, y + d, h, origin),
    iso(x, y + d, h, origin),
  ];
  const right = [
    iso(x + w, y, h, origin),
    iso(x + w, y + d, h, origin),
    iso(x + w, y + d, 0, origin),
    iso(x + w, y, 0, origin),
  ];
  const left = [
    iso(x, y + d, h, origin),
    iso(x + w, y + d, h, origin),
    iso(x + w, y + d, 0, origin),
    iso(x, y + d, 0, origin),
  ];
  const center = iso(x + w / 2, y + d / 2, h, origin);
  const front = iso(x + w, y + d, h, origin);
  return { top, right, left, center, front };
}

/** Flat tile on the floor (z = 0). */
export function floorTile(
  x: number,
  y: number,
  w: number,
  d: number,
  origin: IsoPoint,
) {
  return [
    iso(x, y, 0, origin),
    iso(x + w, y, 0, origin),
    iso(x + w, y + d, 0, origin),
    iso(x, y + d, 0, origin),
  ];
}
