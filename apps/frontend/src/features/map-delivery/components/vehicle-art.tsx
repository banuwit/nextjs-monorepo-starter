import type { VanBody } from "../types/map-delivery";

type VehicleArtProps = {
  body: VanBody;
  color: string;
  /** Parcels currently on board, drawn as boxes in the cargo bay. */
  parcels: number;
  capacity: number;
  view: "iso" | "2d";
};

/** Simple vector drawings per body type; the cargo bay fills with the load. */
export function VehicleArt({ body, color, parcels, capacity, view }: VehicleArtProps) {
  const boxes = Math.min(Math.round((parcels / Math.max(capacity, 1)) * 12), 12);
  const bay = bays[body];

  return (
    <svg
      viewBox="0 0 240 140"
      role="img"
      aria-label={`${body} with ${parcels} of ${capacity} parcels on board`}
      className="h-auto w-full max-w-xs"
    >
      <defs>
        <linearGradient id="va-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.95" />
          <stop offset="1" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <g transform={view === "iso" ? "skewY(-8) translate(0 20)" : undefined} className="transition-transform">
        <ellipse cx="120" cy="124" rx="100" ry="6" className="fill-foreground/10" />
        {body === "cargo-bike" ? <Bike color={color} /> : <Van body={body} color={color} />}
        <g>
          {Array.from({ length: boxes }, (_, index) => {
            const col = index % 4;
            const row = Math.floor(index / 4);
            return (
              <rect
                key={index}
                x={bay.x + col * 13}
                y={bay.y + bay.h - 11 - row * 12}
                width="11"
                height="10"
                rx="1.5"
                className="fill-amber-300 stroke-amber-700/60"
                strokeWidth="0.8"
              />
            );
          })}
        </g>
      </g>
    </svg>
  );
}

const bays: Record<VanBody, { x: number; y: number; h: number }> = {
  "cargo-van": { x: 52, y: 46, h: 44 },
  "box-truck": { x: 42, y: 36, h: 54 },
  reefer: { x: 42, y: 36, h: 54 },
  "cargo-bike": { x: 32, y: 60, h: 34 },
};

function Van({ body, color }: { body: VanBody; color: string }) {
  const tall = body !== "cargo-van";
  return (
    <g>
      <rect x="36" y={tall ? 30 : 40} width={tall ? 120 : 110} height={tall ? 66 : 56} rx="6" fill="url(#va-body)" />
      <path
        d={tall ? "M156 50 h36 l18 24 v22 h-54 z" : "M146 56 h40 l16 20 v20 h-56 z"}
        fill={color}
        opacity="0.85"
      />
      <path d={tall ? "M162 54 h26 l12 18 h-38 z" : "M152 60 h30 l10 14 h-40 z"} className="fill-sky-100/90" />
      <rect x="36" y="88" width={tall ? 174 : 166} height="8" rx="2" className="fill-foreground/70" />
      {body === "reefer" && (
        <g className="fill-background" transform="translate(44 36)">
          <rect width="26" height="14" rx="3" fill={color} opacity="0.4" />
          <path d="M13 2 v10 M8 4.5 l10 5 M8 9.5 l10 -5" stroke="currentColor" strokeWidth="1.5" className="stroke-background" />
        </g>
      )}
      <circle cx="70" cy="100" r="12" className="fill-foreground" />
      <circle cx="70" cy="100" r="5" className="fill-muted" />
      <circle cx="172" cy="100" r="12" className="fill-foreground" />
      <circle cx="172" cy="100" r="5" className="fill-muted" />
      <rect x="40" y={tall ? 44 : 50} width="60" height="40" rx="2" className="fill-background/40" />
    </g>
  );
}

function Bike({ color }: { color: string }) {
  return (
    <g>
      <rect x="28" y="56" width="70" height="40" rx="5" fill="url(#va-body)" />
      <rect x="32" y="60" width="62" height="34" rx="2" className="fill-background/40" />
      <path d="M98 92 L132 70 L170 92" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <path d="M132 70 L128 52 L142 52" fill="none" className="stroke-foreground" strokeWidth="4" strokeLinecap="round" />
      <circle cx="36" cy="102" r="12" fill="none" className="stroke-foreground" strokeWidth="4" />
      <circle cx="98" cy="102" r="12" fill="none" className="stroke-foreground" strokeWidth="4" />
      <circle cx="170" cy="102" r="14" fill="none" className="stroke-foreground" strokeWidth="4" />
      <circle cx="132" cy="92" r="6" className="fill-foreground" />
    </g>
  );
}
