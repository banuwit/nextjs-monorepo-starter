export type TierId = "lower" | "middle" | "upper";

export type Tier = {
  id: TierId;
  label: string;
  /** Inner and outer radius of the ring in scene units. */
  innerRadius: number;
  outerRadius: number;
  /** Height of the tier slab and the elevation of its base. */
  baseY: number;
  height: number;
  sectorCount: number;
};

export type Sector = {
  id: string;
  label: string;
  tier: TierId;
  /** Position within the tier, used for walking order. */
  index: number;
  /** Start and end angle in degrees, counter-clockwise from the east end. */
  startAngle: number;
  endAngle: number;
  capacity: number;
  seatsLeft: number;
  bestPrice: number;
  topPrice: number;
  /** 0–100 subjective view quality. */
  viewScore: number;
};

export type Fixture = {
  home: string;
  away: string;
  competition: string;
  kickoff: string;
  venue: string;
  city: string;
  currency: string;
  bookingFee: number;
};

export type DailySale = { date: string; seats: number };

export type StadiumData = {
  fixture: Fixture;
  tiers: Tier[];
  sectors: Sector[];
  dailySales: DailySale[];
};

export type SceneView = "3d" | "plan";
export type RenderMode = "demand" | "always";

export type TierSummary = {
  tier: Tier;
  openSectors: number;
  totalSectors: number;
  seatsLeft: number;
  capacity: number;
  fromPrice: number | null;
};

export type StadiumTotals = {
  capacity: number;
  seatsLeft: number;
  openSectors: number;
  soldOutSectors: number;
  fromPrice: number | null;
  tiers: TierSummary[];
};
