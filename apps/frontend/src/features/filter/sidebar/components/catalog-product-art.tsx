import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type {
  CatalogColorOption,
  CatalogIllustration,
} from "../types/catalog-filter";
import { CATALOG_ILLUSTRATIONS } from "./catalog-illustrations";

// Stands in for product photography; the drawing follows the product color.
export function CatalogProductArt({
  illustration,
  color,
  label,
  className,
  artClassName,
}: {
  illustration: CatalogIllustration;
  color: CatalogColorOption;
  label?: string;
  className?: string;
  artClassName?: string;
}) {
  const Illustration = CATALOG_ILLUSTRATIONS[illustration];
  const paint = {
    "--art-base": color.hex,
    "--art-shade": `color-mix(in oklab, ${color.hex} 70%, black)`,
    "--art-light": `color-mix(in oklab, ${color.hex} 55%, white)`,
    "--art-deep": `color-mix(in oklab, ${color.hex} 25%, #0b0b10)`,
    "--art-ink": `color-mix(in oklab, ${color.hex} 35%, var(--foreground))`,
    "--art-seam": `color-mix(in oklab, ${color.hex} 55%, #8a8a8a)`,
    "--art-metal": "#c4c4cc",
  } as CSSProperties;

  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className={cn(
        "flex items-center justify-center overflow-hidden transition-colors",
        className,
      )}
      style={{
        backgroundColor: `color-mix(in oklab, ${color.hex} 20%, var(--muted))`,
      }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        fill="none"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={paint}
        className={cn(
          "size-[78%] drop-shadow-[0_0.5rem_0.625rem_rgb(0_0_0/0.28)] transition-transform motion-reduce:transition-none",
          artClassName,
        )}
      >
        <Illustration />
      </svg>
    </div>
  );
}
