export type ProductIllustration =
  | "biker-jacket"
  | "puffer-jacket"
  | "tank-set"
  | "denim-set"
  | "runner"
  | "backpack"
  | "watch"
  | "sunglasses";

export type ProductCategory = "Apparel" | "Footwear" | "Bags" | "Accessories";

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc";

export type ProductColor = { id: string; name: string; hex: string };

export type ProductSize = { label: string; available: boolean };

export type ProductSpec = { label: string; value: string };

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  body: string;
};

// Monetary values are integer cents, matching CheckoutItem.
export type Product = {
  id: string;
  name: string;
  collection: string;
  category: ProductCategory;
  illustration: ProductIllustration;
  tagline: string;
  description: string;
  highlights: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  releasedAt: string;
  inStock: boolean;
  colors: ProductColor[];
  sizes: ProductSize[];
  specs: ProductSpec[];
  reviews: ProductReview[];
};

export type ProductFilters = {
  category: string | null;
  colorIds: string[];
  inStockOnly: boolean;
  onSaleOnly: boolean;
};
