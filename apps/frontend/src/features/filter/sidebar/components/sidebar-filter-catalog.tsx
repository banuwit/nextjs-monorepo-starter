"use client";

import { FunnelIcon, SearchIcon, SearchXIcon } from "lucide-react";
import { useId, useMemo, useState } from "react";

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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  CatalogFilterState,
  CatalogProduct,
} from "../types/catalog-filter";
import {
  countActiveCatalogFilters,
  countCatalogOptions,
  createEmptyCatalogFilter,
  isSameCatalogFilter,
  listCatalogChips,
  matchesCatalogFilter,
  removeCatalogChip,
} from "../utils/catalog-filter";
import { CatalogProductCard } from "./catalog-product-card";
import { FilterSidebar, type FilterSidebarOptions } from "./filter-sidebar";

const PAGE_SIZE = 24;

/** Six columns at full width; the count steps down with the grid's own width, not the page's. */
const GRID_CLASS =
  "grid grid-cols-2 gap-3 @md:grid-cols-3 @2xl:grid-cols-4 @4xl:grid-cols-5 @5xl:grid-cols-6";

export function SidebarFilterCatalog({
  products,
  options,
}: {
  products: CatalogProduct[];
  options: FilterSidebarOptions;
}) {
  const sidebarId = useId();
  const empty = useMemo(
    () => createEmptyCatalogFilter(options.priceMax),
    [options.priceMax],
  );
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState<CatalogFilterState>(empty);
  const [applied, setApplied] = useState<CatalogFilterState>(empty);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const labels = useMemo(
    () => ({
      department: new Map(options.departments.map((o) => [o.value, o.label])),
      category: new Map(options.categories.map((o) => [o.value, o.label])),
      material: new Map(options.materials.map((o) => [o.value, o.label])),
      brand: new Map(options.brands.map((o) => [o.value, o.label])),
      color: new Map(
        options.colors.map((o) => [o.value, { label: o.label, hex: o.hex }]),
      ),
      rating: new Map(options.ratings.map((o) => [o.value, o.label])),
      priceMax: options.priceMax,
    }),
    [options],
  );
  const colorOptions = useMemo(
    () => new Map(options.colors.map((o) => [o.value, o])),
    [options.colors],
  );

  const counts = useMemo(
    () => ({
      categories: countCatalogOptions(products, (p) => p.category),
      materials: countCatalogOptions(products, (p) => p.material),
      brands: countCatalogOptions(products, (p) => p.brand),
    }),
    [products],
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter(
      (product) =>
        matchesCatalogFilter(product, applied) &&
        (!term ||
          product.name.toLowerCase().includes(term) ||
          product.id.toLowerCase().includes(term)),
    );
  }, [products, applied, search]);

  const chips = useMemo(() => listCatalogChips(draft, labels), [draft, labels]);
  const activeCount = countActiveCatalogFilters(applied, options.priceMax);
  const canApply = !isSameCatalogFilter(draft, applied);
  const visible = rows.slice(0, limit);

  const applyDraft = () => {
    setApplied(draft);
    setLimit(PAGE_SIZE);
  };
  const clearAll = () => {
    setDraft(empty);
    setApplied(empty);
    setLimit(PAGE_SIZE);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start">
      <div
        inert={!open}
        className={cn(
          "min-w-0 shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out motion-reduce:transition-none md:sticky md:top-16 md:self-start",
          open ? "md:w-72" : "md:w-0",
          !open && "max-md:hidden",
        )}
      >
        <div className="md:w-72">
          <FilterSidebar
            id={sidebarId}
            value={draft}
            onValueChange={setDraft}
            chips={chips}
            onRemoveChip={(chipId) =>
              setDraft(removeCatalogChip(draft, chipId, options.priceMax))
            }
            options={options}
            counts={counts}
            canApply={canApply}
            onApply={applyDraft}
            onClearAll={clearAll}
            onClose={() => setOpen(false)}
          />
        </div>
      </div>

      <div className="@container flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label={open ? "Hide filters" : "Show filters"}
            title={open ? "Hide filters" : "Show filters"}
            aria-expanded={open}
            aria-controls={sidebarId}
            className="relative"
            onClick={() => setOpen((value) => !value)}
          >
            <FunnelIcon />
            {activeCount > 0 && (
              <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 tabular-nums">
                {activeCount}
              </Badge>
            )}
          </Button>
          <div className="relative w-56">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search product..."
              aria-label="Search product"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setLimit(PAGE_SIZE);
              }}
              className="pl-8"
            />
          </div>
          <p role="status" className="ml-auto text-sm text-muted-foreground">
            {rows.length} of {products.length} products
          </p>
        </div>

        {rows.length > 0 ? (
          <>
            <div className={GRID_CLASS}>
              {visible.map((product) => {
                const color = colorOptions.get(product.color);
                return color ? (
                  <CatalogProductCard
                    key={product.id}
                    product={product}
                    brand={labels.brand.get(product.brand) ?? product.brand}
                    color={color}
                  />
                ) : null;
              })}
            </div>
            {visible.length < rows.length && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setLimit((value) => value + PAGE_SIZE)}
                >
                  Load more ({rows.length - visible.length} left)
                </Button>
              </div>
            )}
          </>
        ) : (
          <Empty className="border border-dashed border-border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchXIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No products found</EmptyTitle>
              <EmptyDescription>
                Loosen a filter in the sidebar or try another search.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  clearAll();
                  setSearch("");
                }}
              >
                Clear filters
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </div>
  );
}
