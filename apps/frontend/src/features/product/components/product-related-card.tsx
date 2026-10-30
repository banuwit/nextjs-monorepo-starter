import Link from "next/link";
import type { Product } from "../types/product";
import { getProductHref } from "../utils/product";
import { ProductArt } from "./product-art";
import { ProductPrice } from "./product-price";

export function ProductRelatedCard({ product }: { product: Product }) {
  const color = product.colors[0];

  if (!color) return null;

  return (
    <Link
      href={getProductHref(product.id)}
      className="group/card flex items-center gap-3 rounded-lg border border-border bg-card p-2 text-card-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <ProductArt
        illustration={product.illustration}
        color={color}
        className="size-16 shrink-0 rounded-md"
      />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-medium group-hover/card:underline">
          {product.name}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {product.collection}
        </span>
        <ProductPrice product={product} className="text-sm" />
      </span>
    </Link>
  );
}
