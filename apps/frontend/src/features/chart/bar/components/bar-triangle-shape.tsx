import type { BarShapeProps } from "recharts";

/** Curved triangle from the Recharts "Custom Shape Bar Chart" example. */
function trianglePath(x: number, y: number, width: number, height: number) {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2},${y}C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width},${y + height}Z`;
}

/** Bar `shape` renderer that draws a triangle instead of a rectangle. */
export function BarTriangleShape({ x, y, width, height, fill }: BarShapeProps) {
  return (
    <path d={trianglePath(x, y, width, height)} fill={fill} stroke="none" />
  );
}
