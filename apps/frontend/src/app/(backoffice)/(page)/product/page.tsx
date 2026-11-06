import { Suspense } from "react";
import type { Metadata } from "next";
import {
  ProductCatalogPage,
  ProductCatalogSkeleton,
} from "@/features/product/components/product-catalog-page";

export const metadata: Metadata = {
  title: "Checkout | Dashboard",
  description: "Browse the product catalog and open a product to check out.",
};

export default function Page() {
  return (
    <Suspense fallback={<ProductCatalogSkeleton />}>
      <ProductCatalogPage />
    </Suspense>
  );
}
