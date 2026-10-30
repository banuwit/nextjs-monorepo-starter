export type CompareSpecId =
  | "type"
  | "colors"
  | "weight"
  | "noiseCancelling"
  | "spatialAudio"
  | "driverSize"
  | "codecs"
  | "bluetooth"
  | "multipoint"
  | "batteryLife"
  | "fastCharging";

export type CompareSpecValue = string | boolean;

export type CompareProductTone =
  | "graphite"
  | "silver"
  | "amber"
  | "emerald"
  | "rose"
  | "sky";

export type CompareProduct = {
  id: string;
  name: string;
  tags: [string, string];
  tone: CompareProductTone;
  rating: number;
  reviewCount: number;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  specs: Record<CompareSpecId, CompareSpecValue>;
};

export type CompareSpec = {
  id: CompareSpecId;
  label: string;
  hint?: string;
};

export type CompareSpecGroup = {
  id: string;
  title: string;
  specs: CompareSpec[];
};
