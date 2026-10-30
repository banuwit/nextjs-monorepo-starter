import type {
  Product,
  ProductColor,
  ProductFilters,
  ProductSort,
} from "../types/product";

export const PRODUCT_SORT_OPTIONS: { label: string; value: ProductSort }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
];

export const EMPTY_PRODUCT_FILTERS: ProductFilters = {
  category: null,
  colorIds: [],
  inStockOnly: false,
  onSaleOnly: false,
};

export const PRODUCT_SHIPPING_NOTES = [
  "Free standard shipping on every order, delivered in 5–7 business days.",
  "Express and overnight delivery are available at checkout.",
  "Return unworn items within 30 days for a full refund.",
  "Every product is covered by a 1-year warranty.",
];

export function parseProductCatalogQuery(
  params: URLSearchParams,
  products: Product[],
): { filters: ProductFilters; sort: ProductSort } {
  const category = params.get("category");
  const colorIds = getProductColorOptions(products).map((color) => color.id);
  const sort = PRODUCT_SORT_OPTIONS.find(
    (option) => option.value === params.get("sort"),
  );

  return {
    filters: {
      category: products.some((product) => product.category === category)
        ? category
        : null,
      colorIds: params.getAll("color").filter((id) => colorIds.includes(id)),
      inStockOnly: params.get("inStock") === "1",
      onSaleOnly: params.get("sale") === "1",
    },
    sort: sort?.value ?? "featured",
  };
}

export function createProductCatalogQuery(
  { category, colorIds, inStockOnly, onSaleOnly }: ProductFilters,
  sort: ProductSort,
) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  for (const colorId of colorIds) params.append("color", colorId);
  if (inStockOnly) params.set("inStock", "1");
  if (onSaleOnly) params.set("sale", "1");
  if (sort !== "featured") params.set("sort", sort);
  return params.toString();
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatProductCurrency(cents: number) {
  return currency.format(cents / 100);
}

export function getProductDiscount(product: Product) {
  if (!product.compareAtPrice) return 0;
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
}

export function getProductColorOptions(products: Product[]) {
  const colors = new Map<string, ProductColor>();
  for (const product of products) {
    for (const color of product.colors) colors.set(color.id, color);
  }
  return [...colors.values()];
}

export function filterProducts(
  products: Product[],
  { category, colorIds, inStockOnly, onSaleOnly }: ProductFilters,
) {
  return products.filter(
    (product) =>
      (!category || product.category === category) &&
      (!inStockOnly || product.inStock) &&
      (!onSaleOnly || getProductDiscount(product) > 0) &&
      (colorIds.length === 0 ||
        product.colors.some((color) => colorIds.includes(color.id))),
  );
}

export function sortProducts(products: Product[], sort: ProductSort) {
  if (sort === "featured") return products;

  return [...products].sort((a, b) => {
    if (sort === "newest") return b.releasedAt.localeCompare(a.releasedAt);
    return sort === "price-asc" ? a.price - b.price : b.price - a.price;
  });
}

export function getRelatedProducts(product: Product, products: Product[]) {
  const others = products.filter((other) => other.id !== product.id);
  return [
    ...others.filter((other) => other.category === product.category),
    ...others.filter((other) => other.category !== product.category),
  ].slice(0, 4);
}

export function getProductHref(productId: string, colorId?: string) {
  const query = colorId ? `?color=${encodeURIComponent(colorId)}` : "";
  return `/features/product/${encodeURIComponent(productId)}${query}`;
}

export function getProductOrderHref(
  productId: string,
  colorId: string,
  size: string,
) {
  const query = new URLSearchParams({
    product: productId,
    color: colorId,
    size,
  });
  return `/features/checkout?${query}`;
}
