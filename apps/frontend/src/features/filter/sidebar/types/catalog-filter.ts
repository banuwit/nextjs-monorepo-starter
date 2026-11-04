export type CatalogDepartment = "women" | "men" | "kids";

/** Drawing that stands in for product photography; a copy of the product feature's set. */
export type CatalogIllustration =
  | "biker-jacket"
  | "puffer-jacket"
  | "tank-set"
  | "denim-set"
  | "runner"
  | "backpack"
  | "watch"
  | "sunglasses";

export type CatalogFacetOption = { value: string; label: string };

export type CatalogColorOption = CatalogFacetOption & { hex: string };

/** Minimum star rating ("4★ & up"). */
export type CatalogRatingOption = { value: number; label: string };

export type CatalogProduct = {
  id: string;
  name: string;
  brand: string;
  department: CatalogDepartment;
  category: string;
  material: string;
  color: string;
  illustration: CatalogIllustration;
  sizes: string[];
  /** Whole dollars. */
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  onSale: boolean;
};

export type CatalogFilterState = {
  /** `null` is the "All" pill. */
  department: CatalogDepartment | null;
  categories: string[];
  materials: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  /** Minimum rating, or `null` for any. */
  rating: number | null;
  inStockOnly: boolean;
  onSaleOnly: boolean;
};

/** A removable chip above the facets; `id` encodes which part of the state it clears. */
export type CatalogFilterChip = {
  id: string;
  label: string;
  hex?: string;
};
