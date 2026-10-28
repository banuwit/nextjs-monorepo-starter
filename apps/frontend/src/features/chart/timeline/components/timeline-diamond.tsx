/** Diamond marker for `ReferenceDot`'s `shape` prop (milestones). */
export function TimelineDiamond({
  cx = 0,
  cy = 0,
  size = 7,
}: {
  cx?: number;
  cy?: number;
  size?: number;
}) {
  return (
    <path
      d={`M${cx} ${cy - size}L${cx + size} ${cy}L${cx} ${cy + size}L${cx - size} ${cy}Z`}
      fill="var(--color-milestone)"
      stroke="var(--background)"
      strokeWidth={2}
    />
  );
}
