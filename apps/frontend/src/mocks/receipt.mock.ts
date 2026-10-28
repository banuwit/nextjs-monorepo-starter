import type { Receipt } from "@/features/receipt/types/receipt";

export const receipt: Receipt = {
  id: "RCT-2026-018042",
  orderId: "HLD-2026-18042",
  date: "May 18, 2026",
  shop: { name: "ReUI", website: "reui.io", supportEmail: "support@reui.io" },
  customerEmail: "jordan@example.com",
  items: [
    {
      id: "jacket",
      name: "Field Shell Jacket",
      variant: "Olive · M",
      quantity: 1,
      unitPrice: 18500,
    },
    {
      id: "vest",
      name: "Compass Down Vest",
      variant: "Slate · M",
      quantity: 1,
      unitPrice: 22800,
    },
    {
      id: "shirt",
      name: "Linen Field Shirt",
      variant: "Sand · M",
      quantity: 2,
      unitPrice: 12800,
    },
  ],
  shipping: 1200,
  discount: 10035,
  discountCode: "WELCOME15",
  tax: 5127,
  payment: { method: "Visa · 4242", chargedAt: "May 18, 2026 at 9:42 AM" },
  shipTo: {
    name: "Jordan Reeves",
    lines: [
      "180 Bedford Avenue",
      "Apt 4F",
      "Brooklyn, NY 11211",
      "United States",
    ],
  },
  shipment: {
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS Ground",
    arrival: "May 22, 2026 to May 25, 2026",
  },
};
