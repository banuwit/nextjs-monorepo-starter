import type { DraftPreview } from "../types/draft-preview";

export function calculateDraftPreview(draftPreview: DraftPreview) {
  const factor = draftPreview.currency === "IDR" ? 1 : 100;
  const safe = (n: number) => (Number.isFinite(n) ? Math.max(0, n) : 0);
  const round = (value: number) =>
    Math.round(value + Math.max(1, Math.abs(value)) * Number.EPSILON);
  const amounts = draftPreview.items.map((item) =>
    round(safe(item.quantity) * safe(item.rate) * factor),
  );
  const subtotal = amounts.reduce((sum, value) => sum + value, 0);
  const discount = Math.min(
    subtotal,
    round(
      draftPreview.discountType === "percent"
        ? (subtotal * safe(draftPreview.discountValue)) / 100
        : safe(draftPreview.discountValue) * factor,
    ),
  );
  const tax = round(((subtotal - discount) * safe(draftPreview.taxRate)) / 100);
  return {
    lines: amounts.map((amount) => amount / factor),
    subtotal: subtotal / factor,
    discount: discount / factor,
    tax: tax / factor,
    total: (subtotal - discount + tax) / factor,
  };
}

export function formatMoney(
  value: number,
  currency: DraftPreview["currency"],
  maximumFractionDigits = currency === "IDR" ? 0 : 2,
) {
  return new Intl.NumberFormat(currency === "IDR" ? "id-ID" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "IDR" ? 0 : 2,
    maximumFractionDigits,
  }).format(value);
}

export function draftPreviewFilename(reference: string) {
  const safe = reference
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `draft-preview-${safe || "draft"}.pdf`;
}
