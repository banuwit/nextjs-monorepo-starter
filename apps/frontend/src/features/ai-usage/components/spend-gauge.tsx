import type { ReactNode } from "react";

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 78;
const START_ANGLE = 135;
const SWEEP = 270;
const SEGMENTS = 24;
const SEGMENT_GAP = 3;

function polar(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
}

function arc(from: number, to: number) {
  const start = polar(from, RADIUS);
  const end = polar(to, RADIUS);
  const large = to - from > 180 ? 1 : 0;
  return `M${start.x},${start.y} A${RADIUS},${RADIUS} 0 ${large} 1 ${end.x},${end.y}`;
}

type SpendGaugeProps = {
  /** 0–1 share of the budget used. */
  progress: number;
  /** 0–1 share the month-end projection would use; drawn as a hollow extension. */
  projected?: number;
  label: string;
  children: ReactNode;
};

/** Segmented three-quarter ring: filled segments are spend so far, outlined ones the projection. */
export function SpendGauge({
  progress,
  projected,
  label,
  children,
}: SpendGaugeProps) {
  const used = Math.min(Math.max(progress, 0), 1);
  const ahead = Math.min(Math.max(projected ?? used, used), 1);
  const segmentSweep = SWEEP / SEGMENTS;

  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 size-full"
        role="img"
        aria-label={label}
      >
        {Array.from({ length: SEGMENTS }, (_, index) => {
          const from = START_ANGLE + index * segmentSweep + SEGMENT_GAP / 2;
          const to = START_ANGLE + (index + 1) * segmentSweep - SEGMENT_GAP / 2;
          const position = (index + 0.5) / SEGMENTS;
          const state =
            position <= used
              ? "used"
              : position <= ahead
                ? "projected"
                : "free";
          return (
            <path
              key={index}
              d={arc(from, to)}
              fill="none"
              strokeWidth={state === "projected" ? 4 : 8}
              strokeLinecap="butt"
              strokeDasharray={state === "projected" ? "2 3" : undefined}
              className={
                state === "used"
                  ? "stroke-primary"
                  : state === "projected"
                    ? "stroke-amber-500 dark:stroke-amber-300"
                    : "stroke-border"
              }
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}
