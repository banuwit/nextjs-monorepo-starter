import type { Invoice } from "@/features/invoice/types/invoice";

const address = [
  "180 Bedford Avenue",
  "Apt 4F",
  "Brooklyn, NY 11211",
  "United States",
];

export const invoice: Invoice = {
  id: "INV-2026-018042",
  orderId: "HLD-2026-18042",
  placedAt: "May 18, 2026",
  status: "paid",
  shop: { name: "WIT", supportEmail: "support@example.com" },
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
  shipTo: { name: "Jordan Reeves", lines: address },
  billTo: { name: "Jordan Reeves", lines: address },
  payment: {
    method: "Visa · 4242",
    expires: "04 / 28",
    chargedAt: "May 18, 2026 at 9:42 AM",
  },
  shipment: {
    trackingNumber: "1Z999AA10123456784",
    trackingUrl: "https://www.ups.com/track?tracknum=1Z999AA10123456784",
  },
  steps: [
    {
      id: "placed",
      title: "Order Placed",
      date: "May 18, 2026 · 9:42 AM",
      status: "complete",
    },
    {
      id: "authorized",
      title: "Payment Authorized",
      date: "May 18, 2026 · 9:42 AM",
      status: "complete",
    },
    {
      id: "shipped",
      title: "Shipped",
      date: "May 19, 2026 · 3:18 PM",
      status: "current",
    },
    {
      id: "in-transit",
      title: "In Transit",
      date: "Expected May 20 to 22",
      status: "upcoming",
    },
    {
      id: "delivered",
      title: "Delivered",
      date: "Estimated May 22 to 25",
      status: "upcoming",
    },
  ],
};
