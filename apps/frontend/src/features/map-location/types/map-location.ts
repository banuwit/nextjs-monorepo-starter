/** `{ key, name }` — every dimension reference on a customer row. */
export type CustomerRef = { key: string; name: string };

export type LocationCustomer = {
  key: string;
  name: string;
  branch: CustomerRef;
  employee: CustomerRef;
  category: CustomerRef;
  region: CustomerRef;
  city: CustomerRef;
  district: CustomerRef;
  street: CustomerRef;
  /** Some rows have no coordinates and are counted but never plotted. */
  latitude?: number;
  longitude?: number;
};

export type SalesSummary = {
  totalInvoice: number;
  salesAmount: number;
  quantityCtn: number;
  quantityKg: number;
  lastDateInvoice: string | null;
};

export type CustomerProfile = LocationCustomer & {
  salesInvoice: SalesSummary;
  salesReturn: SalesSummary;
};

/** Every `*_key` dimension the location report can be filtered by. */
export type FilterKey =
  | "branch"
  | "employee"
  | "category"
  | "customer"
  | "region"
  | "city"
  | "district"
  | "street";

export type FilterState = Record<FilterKey, string[]>;

export const EMPTY_FILTER_STATE: FilterState = {
  branch: [],
  employee: [],
  category: [],
  customer: [],
  region: [],
  city: [],
  district: [],
  street: [],
};

export type MapOverlays = { location: boolean; heat: boolean };
