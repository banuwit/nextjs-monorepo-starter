import { cn } from "@/lib/utils";

/**
 * Decorative trend line. The value it summarises must also be shown as text,
 * so the SVG is hidden from assistive technology.
 */
export function Sparkline({
  values,
  className,
}: {
  values: readonly number[];
  className?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((value, index) => [
    (index / (values.length - 1)) * 100,
    28 - ((value - min) / range) * 24,
  ]);
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const last = points[points.length - 1]!;

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("h-8 w-24 overflow-visible text-primary", className)}
    >
      <polygon points={`0,32 ${line} 100,32`} className="fill-current opacity-10" />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={last[0]}
        cy={last[1]}
        r={2.5}
        className="fill-current"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
