import type { BillingDraft } from "../features/wizard/types/wizard";

export const billingPlans = [
  {
    id: "team",
    name: "Team",
    description: "Workspace controls for growing product teams.",
    price: 49,
  },
  {
    id: "business",
    name: "Business",
    description: "SAML, audit exports, and priority support.",
    price: 72,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Procurement review and account governance.",
    price: 96,
  },
] as const;

export const billingDraft: BillingDraft = {
  plan: "business",
  seats: 42,
  cycle: "annual",
  owner: "maya@kepler.works",
  reason: "team-growth",
  payment: "net-30",
  renewal: "2026-05-31",
  invoiceEmail: "billing@kepler.works",
  purchaseOrder: "PO-2026-184",
};
