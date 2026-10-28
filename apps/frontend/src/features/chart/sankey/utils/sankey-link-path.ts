import type { SankeyLinkProps } from "recharts";

/** Same curve Recharts draws for its default links. */
export function linkPath({
  sourceX,
  sourceY,
  sourceControlX,
  targetX,
  targetY,
  targetControlX,
}: SankeyLinkProps) {
  return `M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`;
}
