import { products } from "@/mocks/product.mock";
import type { CheckoutItem } from "../types/checkout";

// Returns undefined for anything but a known, purchasable selection, so a
// hand-edited URL falls back to the default order.
export function createProductCheckoutItems(
  productId: unknown,
  colorId: unknown,
  sizeLabel: unknown,
): CheckoutItem[] | undefined {
  const product = products.find((item) => item.id === productId);
  const color = product?.colors.find((item) => item.id === colorId);
  const size = product?.sizes.find(
    (item) => item.label === sizeLabel && item.available,
  );
  if (!product?.inStock || !color || !size) return undefined;

  return [
    {
      id: product.id,
      name: product.name,
      variant: `${color.name} • ${size.label}`,
      quantity: 1,
      unitPrice: product.price,
    },
  ];
}
