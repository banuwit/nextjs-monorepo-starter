"use client";

import { cn } from "@/lib/utils";
import type { Sector, Tier } from "../types/stadium";
import { annularSectorPath, isOpen, tierById } from "../utils/stadium";

type StadiumPlanProps = {
  tiers: Tier[];
  sectors: Sector[];
  currency: string;
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (sector: Sector) => void;
};

const tierOpacity: Record<Tier["id"], string> = {
  lower: "fill-primary/85",
  middle: "fill-primary/60",
  upper: "fill-primary/40",
};

export function StadiumPlan({
  tiers,
  sectors,
  currency,
  selectedId,
  hoveredId,
  onHover,
  onSelect,
}: StadiumPlanProps) {
  const extent = (tiers[tiers.length - 1]?.outerRadius ?? 28) + 2;
  return (
    <svg
      viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
      className="mx-auto h-full max-h-[34rem] w-full"
      role="group"
      aria-label="Top-down seating plan"
    >
      <rect
        x={-8.2}
        y={-5.7}
        width={16.4}
        height={11.4}
        rx={0.4}
        className="fill-emerald-500/80 dark:fill-emerald-600/70"
      />
      <rect
        x={-8}
        y={-5.5}
        width={16}
        height={11}
        rx={0.3}
        className="fill-none stroke-white/80"
        strokeWidth={0.18}
      />
      <circle r={1.75} className="fill-none stroke-white/80" strokeWidth={0.18} />
      <line x1={0} y1={-5.5} x2={0} y2={5.5} className="stroke-white/80" strokeWidth={0.18} />
      {sectors.map((sector) => {
        const tier = tierById(tiers, sector.tier);
        const open = isOpen(sector);
        const selected = sector.id === selectedId;
        const hovered = sector.id === hoveredId;
        const label = open
          ? `${sector.label}, ${sector.seatsLeft} seats left from ${currency} ${sector.bestPrice}`
          : `${sector.label}, sold out`;
        return (
          <path
            key={sector.id}
            d={annularSectorPath(
              tier.innerRadius,
              tier.outerRadius,
              sector.startAngle,
              sector.endAngle,
            )}
            role={open ? "button" : undefined}
            tabIndex={open ? 0 : -1}
            aria-label={label}
            aria-pressed={open ? selected : undefined}
            className={cn(
              "transition-[fill,stroke] outline-none",
              open
                ? cn(tierOpacity[tier.id], "cursor-pointer")
                : "fill-muted-foreground/25",
              open && hovered && "fill-primary",
              selected && "fill-primary stroke-ring",
              open && "focus-visible:stroke-ring",
            )}
            strokeWidth={selected ? 0.5 : 0.35}
            onPointerEnter={() => onHover(sector.id)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(sector.id)}
            onBlur={() => onHover(null)}
            onClick={() => open && onSelect(sector)}
            onKeyDown={(event) => {
              if (!open) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(sector);
              }
            }}
          >
            <title>{label}</title>
          </path>
        );
      })}
      {tiers.map((tier) => (
        <text
          key={tier.id}
          x={0}
          y={(tier.innerRadius + tier.outerRadius) / 2 + 0.55}
          textAnchor="middle"
          className="pointer-events-none fill-foreground stroke-card text-[1.5px] font-semibold uppercase tracking-[0.25em] [paint-order:stroke]"
          strokeWidth={0.5}
          strokeLinejoin="round"
        >
          {tier.label.split(" ")[0]}
        </text>
      ))}
    </svg>
  );
}
