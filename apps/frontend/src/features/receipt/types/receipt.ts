export type Receipt = {
  id: string;
  orderId: string;
  date: string;
  shop: { name: string; website: string; supportEmail: string };
  customerEmail: string;
  items: {
    id: string;
    name: string;
    variant: string;
    quantity: number;
    unitPrice: number;
  }[];
  // Monetary values are integer cents, including item unit prices.
  shipping: number;
  discount: number;
  discountCode: string;
  tax: number;
  payment: { method: string; chargedAt: string };
  shipTo: { name: string; lines: string[] };
  shipment: { trackingNumber: string; carrier: string; arrival: string };
};
