import type {
  CatalogColorOption,
  CatalogDepartment,
  CatalogFacetOption,
  CatalogIllustration,
  CatalogProduct,
  CatalogRatingOption,
} from "@/features/filter/sidebar/types/catalog-filter";

export const PRICE_MAX = 200;

export const catalogDepartments: { value: CatalogDepartment; label: string }[] =
  [
    { value: "women", label: "Women" },
    { value: "men", label: "Men" },
    { value: "kids", label: "Kids" },
  ];

export const catalogCategories: CatalogFacetOption[] = [
  { value: "outerwear", label: "Outerwear" },
  { value: "knitwear", label: "Knitwear" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "dresses", label: "Dresses" },
  { value: "footwear", label: "Footwear" },
];

export const catalogMaterials: CatalogFacetOption[] = [
  { value: "cotton", label: "Cotton" },
  { value: "linen", label: "Linen" },
  { value: "wool", label: "Wool" },
  { value: "cashmere", label: "Cashmere" },
  { value: "leather", label: "Leather" },
];

export const catalogBrands: CatalogFacetOption[] = [
  { value: "northline", label: "Northline" },
  { value: "alder", label: "Alder & Co." },
  { value: "mariner", label: "Mariner" },
  { value: "kinfolk", label: "Kinfolk" },
  { value: "studio-form", label: "Studio Form" },
];

export const catalogColors: CatalogColorOption[] = [
  { value: "black", label: "Black", hex: "#18181b" },
  { value: "chalk", label: "Chalk", hex: "#f1efe9" },
  { value: "sand", label: "Sand", hex: "#d6c3a3" },
  { value: "olive", label: "Olive", hex: "#4d5a2a" },
  { value: "navy", label: "Navy", hex: "#1e2a5a" },
  { value: "rust", label: "Rust", hex: "#b5542f" },
];

export const catalogSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const catalogRatings: CatalogRatingOption[] = [
  { value: 4, label: "4★ & up" },
  { value: 3, label: "3★ & up" },
  { value: 2, label: "2★ & up" },
  { value: 1, label: "1★ & up" },
];

// Base names per category; department, material, brand, and color are spread
// with co-prime strides so every facet combination stays reachable.
const baseNames: Record<string, string[]> = {
  outerwear: [
    "Field Jacket",
    "Wool Overcoat",
    "Rain Shell",
    "Quilted Liner",
    "Puffer Jacket",
    "Leather Biker",
    "Trench Coat",
    "Fleece Zip",
  ],
  knitwear: [
    "Crew Sweater",
    "Ribbed Cardigan",
    "Turtleneck",
    "Knit Vest",
    "Cable Pullover",
    "Mock Neck",
    "Cashmere Hoodie",
    "Shawl Cardigan",
  ],
  tops: [
    "Oxford Shirt",
    "Pocket Tee",
    "Linen Camp Shirt",
    "Henley",
    "Flannel Overshirt",
    "Tank Set",
    "Polo Shirt",
    "Striped Tee",
  ],
  bottoms: [
    "Wide-Leg Trouser",
    "Straight Jean",
    "Chino",
    "Pleated Short",
    "Cargo Pant",
    "Relaxed Jean",
    "Track Pant",
    "Linen Trouser",
  ],
  dresses: [
    "Shirt Dress",
    "Slip Dress",
    "Wrap Dress",
    "Knit Midi",
    "Denim Dress",
    "Linen Sundress",
    "Pleated Maxi",
    "Sweater Dress",
  ],
  footwear: [
    "Leather Loafer",
    "Trail Runner",
    "Chelsea Boot",
    "Canvas Sneaker",
    "Court Sneaker",
    "Hiking Boot",
    "Slide Sandal",
    "Derby Shoe",
  ],
};

const illustrations: Record<string, CatalogIllustration[]> = {
  outerwear: ["biker-jacket", "puffer-jacket"],
  knitwear: ["tank-set", "puffer-jacket"],
  tops: ["tank-set"],
  bottoms: ["denim-set"],
  dresses: ["denim-set", "tank-set"],
  footwear: ["runner"],
};

const basePrices: Record<string, number> = {
  outerwear: 140,
  knitwear: 90,
  tops: 45,
  bottoms: 70,
  dresses: 95,
  footwear: 120,
};

export const catalogProducts: CatalogProduct[] = catalogCategories.flatMap(
  (category, categoryIndex) =>
    (baseNames[category.value] ?? []).flatMap((baseName, nameIndex) =>
      catalogDepartments.map((department, departmentIndex) => {
        const index = categoryIndex * 24 + nameIndex * 3 + departmentIndex;
        const art = illustrations[category.value] ?? ["tank-set"];
        const material =
          catalogMaterials[(index * 7) % catalogMaterials.length]!;
        const brand = catalogBrands[(index * 3) % catalogBrands.length]!;
        const color = catalogColors[(index * 5) % catalogColors.length]!;
        const onSale = index % 4 === 1;
        const step = (index % 5) * 12;
        const price = (basePrices[category.value] ?? 60) + step;
        const sizeStart = index % 2;
        const sizeCount = 3 + (index % 3);
        return {
          id: `SKU-${String(index + 1).padStart(3, "0")}`,
          name: `${department.label}'s ${baseName}`,
          brand: brand.value,
          department: department.value,
          category: category.value,
          material: material.value,
          color: color.value,
          illustration: art[nameIndex % art.length] ?? "tank-set",
          sizes: catalogSizes.slice(sizeStart, sizeStart + sizeCount),
          price: onSale ? Math.round(price * 0.8) : price,
          compareAtPrice: onSale ? price : undefined,
          rating: Math.round((2.6 + ((index * 11) % 24) / 10) * 10) / 10,
          reviewCount: 12 + ((index * 37) % 300),
          inStock: index % 7 !== 3,
          onSale,
        };
      }),
    ),
);
