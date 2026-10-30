"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  HeartIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Product, ProductColor } from "../types/product";
import { getProductDiscount, getProductOrderHref } from "../utils/product";
import { ProductColorOption } from "./product-color-option";
import { ProductPrice } from "./product-price";
import { ProductRating } from "./product-rating";
import { ProductSizePicker } from "./product-size-picker";

const PERKS = [
  { label: "5–7 day delivery", icon: TruckIcon },
  { label: "30-day returns", icon: RotateCcwIcon },
  { label: "1-year warranty", icon: ShieldCheckIcon },
];

export function ProductBuyBox({
  product,
  color,
  wishlisted,
  onColorChange,
  onToggleWishlist,
}: {
  product: Product;
  color: ProductColor;
  wishlisted: boolean;
  onColorChange: (color: ProductColor) => void;
  onToggleWishlist: () => void;
}) {
  const colorGroupName = useId();
  const [size, setSize] = useState(
    product.sizes.find((option) => option.available)?.label,
  );
  const discount = getProductDiscount(product);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <ProductRating
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
        <p className="text-sm text-muted-foreground">{product.tagline}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ProductPrice product={product} className="text-xl" />
        {discount > 0 && <Badge variant="destructive">{discount}% off</Badge>}
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">
          Color: <span className="text-muted-foreground">{color.name}</span>
        </p>
        <div role="radiogroup" aria-label="Color" className="flex gap-2">
          {product.colors.map((option) => (
            <ProductColorOption
              key={option.id}
              color={option}
              type="radio"
              name={colorGroupName}
              checked={option.id === color.id}
              className="size-9"
              onChange={() => onColorChange(option)}
            />
          ))}
        </div>
      </div>
      {product.sizes.length > 1 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Select size</p>
          <ProductSizePicker
            sizes={product.sizes}
            value={size}
            onValueChange={setSize}
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="sticky bottom-0 z-10 flex flex-col bg-background py-2 @4xl/main:static @4xl/main:p-0">
          {product.inStock && size ? (
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link href={getProductOrderHref(product.id, color.id, size)} />
              }
            >
              <ShoppingBagIcon aria-hidden="true" />
              Add to bag
            </Button>
          ) : (
            <Button size="lg" disabled>
              Sold out
            </Button>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="lg"
          aria-pressed={wishlisted}
          onClick={onToggleWishlist}
        >
          <HeartIcon
            aria-hidden="true"
            className={cn(wishlisted && "fill-red-500 text-red-500")}
          />
          {wishlisted ? "In wishlist" : "Wishlist"}
        </Button>
      </div>
      <ul className="grid grid-cols-3 gap-2">
        {PERKS.map((perk) => (
          <li
            key={perk.label}
            className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-border p-2 text-center text-xs"
          >
            <perk.icon aria-hidden="true" className="size-4" />
            {perk.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
