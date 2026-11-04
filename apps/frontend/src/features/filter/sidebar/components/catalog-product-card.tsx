import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type {
  CatalogColorOption,
  CatalogProduct,
} from "../types/catalog-filter";
import { formatPrice } from "../utils/catalog-filter";
import { CatalogProductArt } from "./catalog-product-art";

export function CatalogProductCard({
  product,
  brand,
  color,
}: {
  product: CatalogProduct;
  brand: string;
  color: CatalogColorOption;
}) {
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <Card className="group/card relative gap-0 overflow-hidden p-0 transition-shadow hover:shadow-md">
      <CatalogProductArt
        illustration={product.illustration}
        color={color}
        label={`${product.name} in ${color.label}`}
        className="aspect-4/5"
        artClassName="group-hover/card:scale-105"
      />
      <div className="absolute inset-x-2 top-2 flex flex-wrap gap-1">
        {discount > 0 && (
          <Badge className="bg-destructive text-white">-{discount}%</Badge>
        )}
        {!product.inStock && (
          <Badge className="bg-background text-foreground">Sold out</Badge>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1 p-2.5">
        <p className="truncate text-xs text-muted-foreground">{brand}</p>
        <h3 className="truncate text-sm font-medium" title={product.name}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full border border-foreground/25"
            style={{ backgroundColor: color.hex }}
          />
          <span className="truncate">{color.label}</span>
          <span className="ml-auto flex shrink-0 items-center gap-0.5 tabular-nums">
            <StarIcon className="size-3 fill-amber-500 text-amber-500" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <p className="flex items-baseline gap-1.5 text-sm tabular-nums">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {product.compareAtPrice !== undefined && (
            <s className="text-xs text-muted-foreground">
              {formatPrice(product.compareAtPrice)}
            </s>
          )}
        </p>
      </div>
    </Card>
  );
}
