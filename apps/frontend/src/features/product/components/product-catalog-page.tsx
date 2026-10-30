"use client";

import { useId, useState } from "react";
import { SearchXIcon, SlidersHorizontalIcon } from "lucide-react";
import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { products } from "@/mocks/product.mock";
import { useProductCatalog } from "../hooks/use-product-catalog";
import { useProductWishlist } from "../hooks/use-product-wishlist";
import { getProductColorOptions, PRODUCT_SORT_OPTIONS } from "../utils/product";
import { ProductCard } from "./product-card";
import { ProductFiltersPanel } from "./product-filters";

const categories = [
  ...new Set(products.map((product) => product.category)),
];
const colors = getProductColorOptions(products);

const PRODUCT_GRID_CLASS =
  "grid grid-cols-2 gap-3 @4xl/main:grid-cols-3 @4xl/main:gap-4 @6xl/main:grid-cols-4";

export function ProductCatalogSkeleton() {
  return (
    <AppBody>
      <PageHeading title="Products" currentPage="Products" />
      <div className={PRODUCT_GRID_CLASS}>
        {products.map((product) => (
          <Skeleton key={product.id} className="aspect-3/5 rounded-xl" />
        ))}
      </div>
    </AppBody>
  );
}

export function ProductCatalogPage() {
  const catalog = useProductCatalog(products);
  const wishlist = useProductWishlist(["puffer-jacket"]);
  const { visibleProducts, activeFilterCount } = catalog;
  const [showFilters, setShowFilters] = useState(activeFilterCount > 0);
  const filtersId = useId();

  return (
    <AppBody>
      <PageHeading
        title="Products"
        currentPage="Products"
        description="Polished outerwear, easy layers, and everyday essentials."
      >
        <Button
          type="button"
          variant="outline"
          aria-expanded={showFilters}
          aria-controls={showFilters ? filtersId : undefined}
          onClick={() => setShowFilters((current) => !current)}
        >
          <SlidersHorizontalIcon aria-hidden="true" />
          {showFilters ? "Hide filters" : "Show filters"}
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount}</Badge>
          )}
        </Button>
        <Select
          items={PRODUCT_SORT_OPTIONS}
          value={catalog.sort}
          onValueChange={(next) => next && catalog.setSort(next)}
        >
          <SelectTrigger aria-label="Sort by" className="min-w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="end">
            <SelectGroup>
              {PRODUCT_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </PageHeading>

      {showFilters && (
        <ProductFiltersPanel
          id={filtersId}
          filters={catalog.filters}
          categories={categories}
          colors={colors}
          showClear={activeFilterCount > 0}
          onCategoryChange={catalog.setCategory}
          onInStockOnlyChange={catalog.setInStockOnly}
          onOnSaleOnlyChange={catalog.setOnSaleOnly}
          onToggleColor={catalog.toggleColor}
          onClear={catalog.clearFilters}
        />
      )}

      <p role="status" className="text-sm text-muted-foreground">
        {visibleProducts.length} of {products.length} products
      </p>

      {visibleProducts.length > 0 ? (
        <div className={PRODUCT_GRID_CLASS}>
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlisted={wishlist.has(product.id)}
              onToggleWishlist={() => wishlist.toggle(product.id)}
            />
          ))}
        </div>
      ) : (
        <Empty className="border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchXIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No products found</EmptyTitle>
            <EmptyDescription>
              Try removing a filter to see more products.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={catalog.clearFilters}
            >
              Clear filters
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </AppBody>
  );
}
