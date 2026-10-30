"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  Product,
  ProductFilters,
  ProductSort,
} from "../types/product";
import {
  createProductCatalogQuery,
  EMPTY_PRODUCT_FILTERS,
  filterProducts,
  parseProductCatalogQuery,
  sortProducts,
} from "../utils/product";

// Filters and sort live in the URL, so Back from a product restores them.
export function useProductCatalog(products: Product[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters, sort } = parseProductCatalogQuery(
    new URLSearchParams(searchParams),
    products,
  );

  const update = (nextFilters: ProductFilters, nextSort: ProductSort) => {
    const query = createProductCatalogQuery(nextFilters, nextSort);
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };
  const patchFilters = (patch: Partial<ProductFilters>) =>
    update({ ...filters, ...patch }, sort);

  return {
    filters,
    sort,
    setSort: (nextSort: ProductSort) => update(filters, nextSort),
    visibleProducts: sortProducts(filterProducts(products, filters), sort),
    activeFilterCount:
      (filters.category ? 1 : 0) +
      filters.colorIds.length +
      (filters.inStockOnly ? 1 : 0) +
      (filters.onSaleOnly ? 1 : 0),
    setCategory: (category: string | null) => patchFilters({ category }),
    setInStockOnly: (inStockOnly: boolean) => patchFilters({ inStockOnly }),
    setOnSaleOnly: (onSaleOnly: boolean) => patchFilters({ onSaleOnly }),
    toggleColor: (colorId: string) =>
      patchFilters({
        colorIds: filters.colorIds.includes(colorId)
          ? filters.colorIds.filter((id) => id !== colorId)
          : [...filters.colorIds, colorId],
      }),
    clearFilters: () => update(EMPTY_PRODUCT_FILTERS, sort),
  };
}
