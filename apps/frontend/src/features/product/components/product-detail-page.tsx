"use client";

import { useState } from "react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { products } from "@/mocks/product.mock";
import { useProductWishlist } from "../hooks/use-product-wishlist";
import type { Product } from "../types/product";
import { getRelatedProducts } from "../utils/product";
import { ProductBuyBox } from "./product-buy-box";
import { ProductDetailTabs } from "./product-detail-tabs";
import { ProductGallery } from "./product-gallery";
import { ProductRelatedCard } from "./product-related-card";

export function ProductDetailPage({
  product,
  initialColorId,
}: {
  product: Product;
  initialColorId?: string;
}) {
  const wishlist = useProductWishlist();
  const [color, setColor] = useState(
    product.colors.find((option) => option.id === initialColorId) ??
      product.colors[0],
  );

  if (!color) return null;

  return (
    <AppBody>
      <PageHeading
        title={product.name}
        currentPage={product.name}
        description={`${product.collection} · ${product.category}`}
      />
      <div className="mt-2 flex flex-col gap-10 @4xl/main:gap-14">
        <div className="grid items-start gap-6 @4xl/main:grid-cols-2 @4xl/main:gap-10">
          <ProductGallery product={product} color={color} />
          <ProductBuyBox
            product={product}
            color={color}
            wishlisted={wishlist.has(product.id)}
            onColorChange={setColor}
            onToggleWishlist={() => wishlist.toggle(product.id)}
          />
        </div>
        <ProductDetailTabs product={product} />
        <section
          aria-labelledby="related-products"
          className="flex flex-col gap-4"
        >
          <h2 id="related-products" className="font-medium">
            You may also like
          </h2>
          <div className="grid gap-3 @lg/main:grid-cols-2 @5xl/main:grid-cols-4">
            {getRelatedProducts(product, products).map((related) => (
              <ProductRelatedCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      </div>
    </AppBody>
  );
}
