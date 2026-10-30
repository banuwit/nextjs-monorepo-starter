import {
  CheckIcon,
  HeadphonesIcon,
  ShoppingBagIcon,
  TagIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CompareProduct, CompareProductTone } from "../types/compare";
import { formatCurrency } from "../utils/compare";
import { CompareRating } from "./compare-rating";

const toneClassNames: Record<CompareProductTone, string> = {
  graphite: "bg-zinc-900 text-zinc-100",
  silver: "bg-zinc-200 text-zinc-600",
  amber: "bg-amber-400 text-amber-950",
  emerald: "bg-emerald-600 text-emerald-50",
  rose: "bg-rose-200 text-rose-800",
  sky: "bg-sky-200 text-sky-800",
};

type CompareProductHeaderProps = {
  product: CompareProduct;
  inCart: boolean;
  onRemove: () => void;
  onToggleCart: () => void;
};

export function CompareProductHeader({
  product,
  inCart,
  onRemove,
  onToggleCart,
}: CompareProductHeaderProps) {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Remove ${product.name} from comparison`}
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      </div>
      <div
        className={cn(
          "relative mx-auto mb-1 flex aspect-square w-full max-w-32 items-center justify-center rounded-lg",
          toneClassNames[product.tone],
        )}
      >
        <HeadphonesIcon className="size-14" strokeWidth={1.25} aria-hidden />
        {product.badge && (
          <Badge className="absolute top-1.5 left-1.5">{product.badge}</Badge>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
        <TagIcon className="size-3 shrink-0" aria-hidden />
        <span className="truncate">{product.tags.join(" · ")}</span>
      </div>
      <p className="truncate font-medium">{product.name}</p>
      <CompareRating rating={product.rating} reviewCount={product.reviewCount} />
      <p className="flex items-baseline gap-1.5">
        <span className="text-base font-semibold tabular-nums">
          {formatCurrency(product.price)}
        </span>
        {product.compareAtPrice !== undefined && (
          <s className="text-xs font-normal text-muted-foreground tabular-nums">
            {formatCurrency(product.compareAtPrice)}
          </s>
        )}
      </p>
      <Button
        className="mt-auto w-full"
        variant={inCart ? "outline" : "default"}
        aria-pressed={inCart}
        onClick={onToggleCart}
      >
        {inCart ? (
          <CheckIcon data-icon="inline-start" />
        ) : (
          <ShoppingBagIcon data-icon="inline-start" />
        )}
        {inCart ? "In cart" : "Add to cart"}
      </Button>
    </div>
  );
}
