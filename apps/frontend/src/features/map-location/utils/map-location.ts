import type { FilterOption } from "@/components/filter/types";
import type {
  CustomerRef,
  FilterKey,
  FilterState,
  LocationCustomer,
} from "../types/map-location";

export type FilterConfig = {
  key: FilterKey;
  title: string;
  /** Customer is single-select, like the source report; the rest are multi. */
  variant?: "single" | "multi";
};

/** Same order as the source page: Branch, Salesman, Cat. Customer, Customer, then the location hierarchy. */
export const FILTERS_CONFIG: FilterConfig[] = [
  { key: "branch", title: "Branch" },
  { key: "employee", title: "Salesman" },
  { key: "category", title: "Cat. Customer" },
  { key: "customer", title: "Customer", variant: "single" },
  { key: "region", title: "Province" },
  { key: "city", title: "City" },
  { key: "district", title: "District" },
  { key: "street", title: "Street" },
];

function refOf(customer: LocationCustomer, key: FilterKey): CustomerRef {
  return key === "customer" ? { key: customer.key, name: customer.name } : customer[key];
}

export function matchesFilters(customer: LocationCustomer, filters: FilterState, skip?: FilterKey) {
  return (Object.keys(filters) as FilterKey[]).every(
    (key) => key === skip || filters[key].length === 0 || filters[key].includes(refOf(customer, key).key),
  );
}

export function filterCustomers(customers: LocationCustomer[], filters: FilterState) {
  return customers.filter((customer) => matchesFilters(customer, filters));
}

/**
 * Options for one dropdown, narrowed by every *other* active filter so the
 * location hierarchy cascades (pick a city → districts of that city only).
 */
export function optionsFor(customers: LocationCustomer[], filters: FilterState, key: FilterKey): FilterOption[] {
  const seen = new Map<string, string>();
  for (const customer of customers) {
    if (!matchesFilters(customer, filters, key)) continue;
    const item = refOf(customer, key);
    if (!seen.has(item.key)) seen.set(item.key, item.name);
  }
  return [...seen]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "id"));
}

/** Labels for the active-filter chips, keyed by option value. */
export function labelsFor(customers: LocationCustomer[]): Record<string, string> {
  const labels: Record<string, string> = {};
  for (const customer of customers) {
    for (const key of Object.keys(EMPTY_KEYS) as FilterKey[]) {
      const item = refOf(customer, key);
      labels[item.key] = item.name;
    }
  }
  return labels;
}

const EMPTY_KEYS: Record<FilterKey, null> = {
  branch: null, employee: null, category: null, customer: null, region: null, city: null, district: null, street: null,
};

export function hasCoordinates(customer: LocationCustomer): customer is LocationCustomer & { latitude: number; longitude: number } {
  return typeof customer.latitude === "number" && typeof customer.longitude === "number";
}

export function activeFilterCount(filters: FilterState) {
  return Object.values(filters).filter((selected) => selected.length > 0).length;
}

const nominal = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

export function formatNominal(value?: number | null) {
  return value == null ? "-" : nominal.format(value);
}

export function formatCount(value?: number | null) {
  return (value ?? 0).toLocaleString("id-ID");
}

export function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

/** "Avg. X" tiles divide the total by the invoice count; "-" when either is missing. */
export function averageNominal(total?: number, count?: number) {
  return !total || !count ? "-" : formatNominal(total / count);
}

export function googleMapsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps/?q=${latitude},${longitude}`;
}
