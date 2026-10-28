import type {
  DailySale,
  Sector,
  StadiumData,
  Tier,
} from "@/features/scenes-3d/types/stadium";

/** Deterministic PRNG so the demo inventory is stable between reloads. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const stadiumTiers: Tier[] = [
  {
    id: "lower",
    label: "Lower tier",
    innerRadius: 11,
    outerRadius: 15.5,
    baseY: 0,
    height: 1.4,
    sectorCount: 24,
  },
  {
    id: "middle",
    label: "Middle tier",
    innerRadius: 16.5,
    outerRadius: 21.5,
    baseY: 1.4,
    height: 2.2,
    sectorCount: 24,
  },
  {
    id: "upper",
    label: "Upper tier",
    innerRadius: 22.5,
    outerRadius: 28,
    baseY: 3.6,
    height: 3,
    sectorCount: 22,
  },
];

const tierPricing = {
  lower: { best: [85, 140], top: [210, 260], seats: [700, 900], prefix: "L" },
  middle: { best: [55, 95], top: [150, 190], seats: [950, 1250], prefix: "M" },
  upper: { best: [28, 55], top: [85, 120], seats: [1300, 1650], prefix: "U" },
} as const;

const SECTOR_GAP_DEGREES = 1.6;

function buildSectors(): Sector[] {
  const random = mulberry32(20261114);
  const sectors: Sector[] = [];

  for (const tier of stadiumTiers) {
    const pricing = tierPricing[tier.id];
    const span = 360 / tier.sectorCount;
    for (let index = 0; index < tier.sectorCount; index += 1) {
      const startAngle = index * span;
      const endAngle = startAngle + span - SECTOR_GAP_DEGREES;
      const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
      // Seats along the touchlines (north/south) see more of the pitch.
      const sideline = Math.abs(Math.sin(midAngle));
      const tierBonus = tier.id === "lower" ? 18 : tier.id === "middle" ? 10 : 0;
      const viewScore = Math.round(
        52 + sideline * 30 + tierBonus + (random() - 0.5) * 8,
      );

      const capacity = Math.round(
        pricing.seats[0] + random() * (pricing.seats[1] - pricing.seats[0]),
      );
      const soldOut = random() < 0.13;
      const fill = soldOut ? 1 : 0.35 + random() * 0.6;
      const seatsLeft = soldOut ? 0 : Math.round(capacity * (1 - fill));
      const premium = (sideline * 0.6 + (viewScore - 50) / 100) * 0.5;
      const bestPrice =
        Math.round(
          (pricing.best[0] + premium * (pricing.best[1] - pricing.best[0])) / 5,
        ) * 5;
      const topPrice =
        Math.round(
          (pricing.top[0] + premium * (pricing.top[1] - pricing.top[0])) / 5,
        ) * 5;

      sectors.push({
        id: `${pricing.prefix}${String(index + 1).padStart(2, "0")}`,
        label: `${pricing.prefix}${String(index + 1).padStart(2, "0")}`,
        tier: tier.id,
        index,
        startAngle,
        endAngle,
        capacity,
        seatsLeft,
        bestPrice,
        topPrice,
        viewScore: Math.max(35, Math.min(98, viewScore)),
      });
    }
  }

  return sectors;
}

function buildDailySales(): DailySale[] {
  const random = mulberry32(7);
  const start = new Date("2026-10-15T00:00:00Z");
  return Array.from({ length: 14 }, (_, day) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + day);
    const trend = 1800 + day * 160;
    return {
      date: date.toISOString().slice(0, 10),
      seats: Math.round(trend + (random() - 0.4) * 900),
    };
  });
}

export const stadiumData: StadiumData = {
  fixture: {
    home: "Northbridge FC",
    away: "Harbour City",
    competition: "Premier Cup · Quarter-final",
    kickoff: "2026-11-14T19:45:00+07:00",
    venue: "Meridian Arena",
    city: "Jakarta",
    currency: "USD",
    bookingFee: 4.5,
  },
  tiers: stadiumTiers,
  sectors: buildSectors(),
  dailySales: buildDailySales(),
};
