import type {
  CatalogFilterChip,
  CatalogFilterState,
  CatalogProduct,
} from "../types/catalog-filter";

export function createEmptyCatalogFilter(priceMax: number): CatalogFilterState {
  return {
    department: null,
    categories: [],
    materials: [],
    brands: [],
    colors: [],
    sizes: [],
    priceRange: [0, priceMax],
    rating: null,
    inStockOnly: false,
    onSaleOnly: false,
  };
}

export function isSameCatalogFilter(
  left: CatalogFilterState,
  right: CatalogFilterState,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

/** Toggles `value` in a list without mutating it. */
export function toggleListValue(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function formatPrice(value: number): string {
  return `$${value}`;
}

/** Number of facets that differ from the empty state; shown on the toolbar button. */
export function countActiveCatalogFilters(
  state: CatalogFilterState,
  priceMax: number,
): number {
  const [min, max] = state.priceRange;
  return [
    state.department !== null,
    state.categories.length > 0,
    state.materials.length > 0,
    state.brands.length > 0,
    state.colors.length > 0,
    state.sizes.length > 0,
    min > 0 || max < priceMax,
    state.rating !== null,
    state.inStockOnly,
    state.onSaleOnly,
  ].filter(Boolean).length;
}

export function matchesCatalogFilter(
  product: CatalogProduct,
  state: CatalogFilterState,
): boolean {
  const [min, max] = state.priceRange;
  return (
    (state.department === null || product.department === state.department) &&
    (state.categories.length === 0 ||
      state.categories.includes(product.category)) &&
    (state.materials.length === 0 ||
      state.materials.includes(product.material)) &&
    (state.brands.length === 0 || state.brands.includes(product.brand)) &&
    (state.colors.length === 0 || state.colors.includes(product.color)) &&
    (state.sizes.length === 0 ||
      state.sizes.some((size) => product.sizes.includes(size))) &&
    product.price >= min &&
    product.price <= max &&
    (state.rating === null || product.rating >= state.rating) &&
    (!state.inStockOnly || product.inStock) &&
    (!state.onSaleOnly || product.onSale)
  );
}

/** How many catalog products carry each option value, counted over the whole catalog. */
export function countCatalogOptions(
  products: CatalogProduct[],
  read: (product: CatalogProduct) => string,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const product of products) {
    const key = read(product);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

type ChipLabels = {
  department: Map<string, string>;
  category: Map<string, string>;
  material: Map<string, string>;
  brand: Map<string, string>;
  color: Map<string, { label: string; hex: string }>;
  rating: Map<number, string>;
  priceMax: number;
};

/** Chips in the order of the sidebar sections; stock/sale toggles have no chip, as in the reference. */
export function listCatalogChips(
  state: CatalogFilterState,
  labels: ChipLabels,
): CatalogFilterChip[] {
  const chips: CatalogFilterChip[] = [];
  if (state.department) {
    chips.push({
      id: `department:${state.department}`,
      label: labels.department.get(state.department) ?? state.department,
    });
  }
  for (const value of state.categories) {
    chips.push({
      id: `category:${value}`,
      label: labels.category.get(value) ?? value,
    });
  }
  for (const value of state.materials) {
    chips.push({
      id: `material:${value}`,
      label: labels.material.get(value) ?? value,
    });
  }
  for (const value of state.colors) {
    const color = labels.color.get(value);
    chips.push({
      id: `color:${value}`,
      label: color?.label ?? value,
      hex: color?.hex,
    });
  }
  for (const value of state.sizes) {
    chips.push({ id: `size:${value}`, label: value });
  }
  for (const value of state.brands) {
    chips.push({
      id: `brand:${value}`,
      label: labels.brand.get(value) ?? value,
    });
  }
  if (state.rating !== null) {
    chips.push({
      id: `rating:${state.rating}`,
      label: labels.rating.get(state.rating) ?? `${state.rating}★ & up`,
    });
  }
  const [min, max] = state.priceRange;
  if (min > 0 || max < labels.priceMax) {
    chips.push({
      id: "price",
      label: `${formatPrice(min)} – ${formatPrice(max)}`,
    });
  }
  return chips;
}

export function removeCatalogChip(
  state: CatalogFilterState,
  chipId: string,
  priceMax: number,
): CatalogFilterState {
  const [kind, value = ""] = chipId.split(":");
  switch (kind) {
    case "department":
      return { ...state, department: null };
    case "category":
      return {
        ...state,
        categories: state.categories.filter((item) => item !== value),
      };
    case "material":
      return {
        ...state,
        materials: state.materials.filter((item) => item !== value),
      };
    case "color":
      return {
        ...state,
        colors: state.colors.filter((item) => item !== value),
      };
    case "size":
      return { ...state, sizes: state.sizes.filter((item) => item !== value) };
    case "brand":
      return {
        ...state,
        brands: state.brands.filter((item) => item !== value),
      };
    case "rating":
      return { ...state, rating: null };
    case "price":
      return { ...state, priceRange: [0, priceMax] };
    default:
      return state;
  }
}

/** Whether a swatch is light enough to need a dark check mark. */
export function isLightHex(hex: string): boolean {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}
