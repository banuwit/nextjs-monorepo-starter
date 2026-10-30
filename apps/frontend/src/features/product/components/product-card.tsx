"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Product } from "../types/product";
import { getProductDiscount, getProductHref } from "../utils/product";
import { ProductArt } from "./product-art";
import { ProductColorOption } from "./product-color-option";
import { ProductPrice } from "./product-price";
import { ProductWishlistButton } from "./product-wishlist-button";

export function ProductCard({
  product,
  wishlisted,
  onToggleWishlist,
}: {
  product: Product;
  wishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  const colorGroupName = useId();
  const [color, setColor] = useState(product.colors[0]);
  const discount = getProductDiscount(product);

  if (!color) return null;

  return (
    <Card className="group/card relative gap-0 overflow-hidden p-0 transition-shadow hover:shadow-md">
      <ProductArt
        illustration={product.illustration}
        color={color}
        label={`${product.name} in ${color.name}`}
        className="aspect-4/5"
        artClassName="group-hover/card:scale-105"
      />
      <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {discount > 0 && (
            <Badge className="bg-destructive text-white">-{discount}%</Badge>
          )}
          {!product.inStock && (
            <Badge className="bg-background text-foreground">Sold out</Badge>
          )}
        </div>
        <ProductWishlistButton
          productName={product.name}
          active={wishlisted}
          onToggle={onToggleWishlist}
          className="relative z-10 ml-auto bg-background"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-2 p-3">
        <p className="truncate text-xs text-muted-foreground">
          {product.collection}
        </p>
        <div className="flex items-center justify-between gap-2">
          <div
            role="radiogroup"
            aria-label={`${product.name} color`}
            className="relative z-10 -ml-0.5 flex flex-wrap gap-1"
          >
            {product.colors.map((option) => (
              <ProductColorOption
                key={option.id}
                color={option}
                type="radio"
                name={colorGroupName}
                checked={option.id === color.id}
                onChange={() => setColor(option)}
              />
            ))}
          </div>
          <span className="hidden truncate text-xs text-muted-foreground @lg/main:inline">
            {color.name}
          </span>
        </div>
        <h2 className="font-medium group-hover/card:underline">
          <Link
            href={getProductHref(product.id, color.id)}
            className="outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
          >
            {product.name}
          </Link>
        </h2>
        <p className="hidden truncate text-sm text-muted-foreground @lg/main:block">
          {product.tagline}
        </p>
        <ProductPrice product={product} className="flex-wrap text-sm" />
      </div>
    </Card>
  );
}
