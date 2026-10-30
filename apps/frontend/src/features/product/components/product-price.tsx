import { cn } from "@/lib/utils";
import type { Product } from "../types/product";
import { formatProductCurrency } from "../utils/product";

export function ProductPrice({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <p className={cn("flex items-baseline gap-2 tabular-nums", className)}>
      {product.compareAtPrice && (
        <s className="font-normal text-muted-foreground">
          <span className="sr-only">Original price </span>
          {formatProductCurrency(product.compareAtPrice)}
        </s>
      )}
      <span className="font-semibold">
        {formatProductCurrency(product.price)}
      </span>
    </p>
  );
}
