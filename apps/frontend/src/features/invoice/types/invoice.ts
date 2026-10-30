export type InvoiceStepStatus = "complete" | "current" | "upcoming";

export type InvoiceStep = {
  id: string;
  title: string;
  date: string;
  status: InvoiceStepStatus;
};

export type InvoiceAddress = { name: string; lines: string[] };

export type Invoice = {
  id: string;
  orderId: string;
  placedAt: string;
  status: "paid";
  shop: { name: string; supportEmail: string };
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
  shipTo: InvoiceAddress;
  billTo: InvoiceAddress;
  payment: { method: string; expires: string; chargedAt: string };
  shipment: { trackingNumber: string; trackingUrl: string };
  steps: InvoiceStep[];
};
