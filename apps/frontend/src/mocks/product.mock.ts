import type {
  Product,
  ProductColor,
  ProductSize,
} from "@/features/product/types/product";

const black: ProductColor = { id: "black", name: "Black", hex: "#18181b" };
const chalk: ProductColor = { id: "chalk", name: "Chalk", hex: "#f1efe9" };
const navy: ProductColor = { id: "navy", name: "Navy", hex: "#1e2a5a" };
const olive: ProductColor = { id: "olive", name: "Olive", hex: "#4d5a2a" };
const cognac: ProductColor = { id: "cognac", name: "Cognac", hex: "#7c3f16" };
const cherry: ProductColor = { id: "cherry", name: "Cherry", hex: "#dc2626" };
const denim: ProductColor = {
  id: "denim",
  name: "Light Denim",
  hex: "#a5cdec",
};
const forest: ProductColor = { id: "forest", name: "Forest", hex: "#15803d" };

const letterSizes = (...soldOut: string[]): ProductSize[] =>
  ["XS", "S", "M", "L", "XL"].map((label) => ({
    label,
    available: !soldOut.includes(label),
  }));

const shoeSizes = (...soldOut: string[]): ProductSize[] =>
  ["39", "40", "41", "42", "43", "44", "45"].map((label) => ({
    label,
    available: !soldOut.includes(label),
  }));

const oneSize: ProductSize[] = [{ label: "One size", available: true }];

export const products: Product[] = [
  {
    id: "biker-jacket",
    name: "Leather Biker Jacket",
    collection: "Studio Outerwear",
    category: "Apparel",
    illustration: "biker-jacket",
    tagline: "Polished leather with a sharp stance.",
    description:
      "A structured biker jacket cut from full-grain leather, with a soft cotton lining and hardware that ages with you.",
    highlights: [
      "Full-grain leather shell",
      "Cotton twill lining",
      "Asymmetric YKK zip closure",
    ],
    price: 24800,
    rating: 4.7,
    reviewCount: 312,
    releasedAt: "2026-09-18",
    inStock: true,
    colors: [black, cognac, olive],
    sizes: letterSizes("XS"),
    specs: [
      { label: "Material", value: "100% cow leather" },
      { label: "Lining", value: "100% cotton" },
      { label: "Fit", value: "Slim" },
      { label: "Care", value: "Specialist leather clean" },
    ],
    reviews: [
      {
        id: "biker-1",
        author: "Maya R.",
        rating: 5,
        body: "Stiff for a week, then it fit like it was made for me.",
      },
      {
        id: "biker-2",
        author: "Dimas P.",
        rating: 4,
        body: "Great leather. Size up if you plan to layer a sweater under it.",
      },
    ],
  },
  {
    id: "puffer-jacket",
    name: "Gloss Puffer Jacket",
    collection: "Cold Weather",
    category: "Apparel",
    illustration: "puffer-jacket",
    tagline: "High-shine warmth with a clean fit.",
    description:
      "A lightweight puffer with a glossy recycled shell and responsibly sourced down that packs into its own pocket.",
    highlights: [
      "700-fill responsibly sourced down",
      "Water-resistant recycled shell",
      "Packs into its own pocket",
    ],
    price: 14800,
    compareAtPrice: 19800,
    rating: 4.5,
    reviewCount: 188,
    releasedAt: "2026-08-02",
    inStock: true,
    colors: [black, chalk, navy, cherry],
    sizes: letterSizes("XL"),
    specs: [
      { label: "Shell", value: "100% recycled nylon" },
      { label: "Fill", value: "700-fill duck down" },
      { label: "Fit", value: "Regular" },
      { label: "Care", value: "Machine wash cold" },
    ],
    reviews: [
      {
        id: "puffer-1",
        author: "Sinta K.",
        rating: 5,
        body: "Warm without the bulk, and the shine looks expensive.",
      },
      {
        id: "puffer-2",
        author: "Arif W.",
        rating: 4,
        body: "Very warm. The pockets could be a little deeper.",
      },
    ],
  },
  {
    id: "tank-set",
    name: "Ribbed Tank Set",
    collection: "Travel Set",
    category: "Apparel",
    illustration: "tank-set",
    tagline: "Soft tank with tapered pull-on pants.",
    description:
      "An easy two-piece in a breathable rib knit, made for long-haul travel and slow weekends alike.",
    highlights: [
      "Breathable rib knit",
      "Elastic drawstring waist",
      "Wrinkle-resistant for travel",
    ],
    price: 8600,
    rating: 4.3,
    reviewCount: 94,
    releasedAt: "2026-10-06",
    inStock: true,
    colors: [chalk, forest, cherry, navy],
    sizes: letterSizes(),
    specs: [
      { label: "Material", value: "60% cotton, 40% modal" },
      { label: "Fit", value: "Relaxed" },
      { label: "Care", value: "Machine wash cold" },
    ],
    reviews: [
      {
        id: "tank-1",
        author: "Laras N.",
        rating: 5,
        body: "Wore it on a 14-hour flight and stepped off still looking neat.",
      },
      {
        id: "tank-2",
        author: "Nadia F.",
        rating: 4,
        body: "Comfortable and soft. The tank runs a little long.",
      },
    ],
  },
  {
    id: "denim-set",
    name: "Wide-Leg Denim Set",
    collection: "Denim Studio",
    category: "Apparel",
    illustration: "denim-set",
    tagline: "Easy tank styling with wide-leg jeans.",
    description:
      "High-rise wide-leg jeans in a mid-weight organic denim, paired with a fitted rib tank.",
    highlights: [
      "Organic cotton denim",
      "High-rise, wide-leg cut",
      "Fitted rib tank included",
    ],
    price: 13200,
    rating: 4.6,
    reviewCount: 142,
    releasedAt: "2026-07-21",
    inStock: true,
    colors: [denim, navy, chalk, black],
    sizes: letterSizes("S"),
    specs: [
      { label: "Material", value: "100% organic cotton" },
      { label: "Rise", value: "High" },
      { label: "Care", value: "Machine wash cold, inside out" },
    ],
    reviews: [
      {
        id: "denim-1",
        author: "Rani S.",
        rating: 5,
        body: "The drape on these jeans is perfect.",
      },
      {
        id: "denim-2",
        author: "Tia M.",
        rating: 4,
        body: "Lovely denim, though I had to hem them for my height.",
      },
    ],
  },
  {
    id: "cloud-runner",
    name: "Cloud Shift Runner",
    collection: "Running",
    category: "Footwear",
    illustration: "runner",
    tagline: "Daily road runner with steady cushion.",
    description:
      "Daily road runner with breathable mesh, a single-density foam midsole, and a rubber outsole built for steady miles.",
    highlights: [
      "Engineered mesh upper with recycled yarn",
      "Single-density EVA midsole, 8 mm drop",
      "Durable rubber outsole",
    ],
    price: 9623,
    compareAtPrice: 12800,
    rating: 4.5,
    reviewCount: 834,
    releasedAt: "2026-10-14",
    inStock: true,
    colors: [cherry, navy, chalk, forest],
    sizes: shoeSizes("44"),
    specs: [
      { label: "Upper", value: "Recycled engineered mesh" },
      { label: "Midsole", value: "EVA foam, 8 mm drop" },
      { label: "Weight", value: "265 g (size 42)" },
    ],
    reviews: [
      {
        id: "runner-1",
        author: "Bayu A.",
        rating: 5,
        body: "My go-to for tempo days. Light, but still protective.",
      },
      {
        id: "runner-2",
        author: "Eka D.",
        rating: 4,
        body: "Took a few runs to break in, and now they feel great.",
      },
    ],
  },
  {
    id: "canvas-backpack",
    name: "Canvas Roll-Top Pack",
    collection: "Commuter",
    category: "Bags",
    illustration: "backpack",
    tagline: "Waxed canvas for the daily commute.",
    description:
      "A weather-ready roll-top backpack with a padded laptop sleeve and enough room to expand for a gym kit.",
    highlights: [
      "Waxed organic canvas",
      "Padded 15-inch laptop sleeve",
      "Expands from 18 to 24 liters",
    ],
    price: 11800,
    rating: 4.8,
    reviewCount: 256,
    releasedAt: "2026-06-30",
    inStock: true,
    colors: [olive, black, cognac],
    sizes: oneSize,
    specs: [
      { label: "Material", value: "Waxed organic canvas" },
      { label: "Capacity", value: "18–24 L" },
      { label: "Laptop sleeve", value: "Up to 15 in" },
    ],
    reviews: [
      {
        id: "pack-1",
        author: "Galih H.",
        rating: 5,
        body: "Stayed dry through a full monsoon commute.",
      },
      {
        id: "pack-2",
        author: "Putri L.",
        rating: 5,
        body: "Simple, sturdy, and it looks better with age.",
      },
    ],
  },
  {
    id: "field-watch",
    name: "Field Automatic Watch",
    collection: "Timepieces",
    category: "Accessories",
    illustration: "watch",
    tagline: "A 38 mm automatic for everyday wear.",
    description:
      "A legible field watch with a self-winding movement, sapphire crystal, and 100 m water resistance.",
    highlights: [
      "Self-winding movement",
      "Sapphire crystal",
      "100 m water resistance",
    ],
    price: 21500,
    rating: 4.9,
    reviewCount: 67,
    releasedAt: "2026-05-12",
    inStock: false,
    colors: [black, forest],
    sizes: oneSize,
    specs: [
      { label: "Case", value: "38 mm stainless steel" },
      { label: "Crystal", value: "Sapphire" },
      { label: "Water resistance", value: "100 m" },
    ],
    reviews: [
      {
        id: "watch-1",
        author: "Hendra T.",
        rating: 5,
        body: "Keeps excellent time and wears comfortably all day.",
      },
      {
        id: "watch-2",
        author: "Wulan C.",
        rating: 5,
        body: "The dial is easy to read at a glance.",
      },
    ],
  },
  {
    id: "acetate-sunglasses",
    name: "Acetate Sunglasses",
    collection: "Summer Edit",
    category: "Accessories",
    illustration: "sunglasses",
    tagline: "Polarized lenses in a classic frame.",
    description:
      "Hand-polished acetate frames with polarized lenses and full UV400 protection.",
    highlights: [
      "Hand-polished acetate frame",
      "Polarized lenses",
      "UV400 protection",
    ],
    price: 7200,
    compareAtPrice: 9000,
    rating: 4.4,
    reviewCount: 121,
    releasedAt: "2026-04-03",
    inStock: true,
    colors: [black, cognac, navy],
    sizes: oneSize,
    specs: [
      { label: "Frame", value: "Bio-based acetate" },
      { label: "Lens", value: "Polarized, UV400" },
      { label: "Includes", value: "Hard case and cloth" },
    ],
    reviews: [
      {
        id: "sunglasses-1",
        author: "Citra V.",
        rating: 5,
        body: "Feel far more expensive than they are.",
      },
      {
        id: "sunglasses-2",
        author: "Reza O.",
        rating: 4,
        body: "Great lenses, though the frame is on the narrow side.",
      },
    ],
  },
];
