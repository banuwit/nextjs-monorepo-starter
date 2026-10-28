import type {
  Sector,
  StadiumData,
  StadiumTotals,
  Tier,
  TierId,
  TierSummary,
} from "../types/stadium";

const tierOrder: TierId[] = ["lower", "middle", "upper"];

export function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatKickoff(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export function isOpen(sector: Sector) {
  return sector.seatsLeft > 0;
}

/** Sectors in the order a visitor would walk the concourse: tier by tier, then clockwise. */
export function walkingOrder(sectors: Sector[]) {
  return [...sectors].sort(
    (a, b) =>
      tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier) || a.index - b.index,
  );
}

export function tierById(tiers: Tier[], id: TierId) {
  return tiers.find((tier) => tier.id === id) ?? tiers[0]!;
}

export function midAngleRadians(sector: Sector) {
  return ((sector.startAngle + sector.endAngle) / 2) * (Math.PI / 180);
}

export function summarizeTier(tier: Tier, sectors: Sector[]): TierSummary {
  const own = sectors.filter((sector) => sector.tier === tier.id);
  const open = own.filter(isOpen);
  return {
    tier,
    openSectors: open.length,
    totalSectors: own.length,
    seatsLeft: own.reduce((sum, sector) => sum + sector.seatsLeft, 0),
    capacity: own.reduce((sum, sector) => sum + sector.capacity, 0),
    fromPrice: open.length
      ? Math.min(...open.map((sector) => sector.bestPrice))
      : null,
  };
}

export function summarizeStadium(data: StadiumData): StadiumTotals {
  const tiers = data.tiers.map((tier) => summarizeTier(tier, data.sectors));
  const open = data.sectors.filter(isOpen);
  return {
    capacity: data.sectors.reduce((sum, sector) => sum + sector.capacity, 0),
    seatsLeft: data.sectors.reduce((sum, sector) => sum + sector.seatsLeft, 0),
    openSectors: open.length,
    soldOutSectors: data.sectors.length - open.length,
    fromPrice: open.length
      ? Math.min(...open.map((sector) => sector.bestPrice))
      : null,
    tiers,
  };
}

export function orderTotal(
  sector: Sector | null,
  seats: number,
  bookingFee: number,
) {
  if (!sector) return { subtotal: 0, fees: 0, total: 0 };
  const subtotal = sector.bestPrice * seats;
  const fees = bookingFee * seats;
  return { subtotal, fees, total: subtotal + fees };
}

/** Move within the list of open sectors by `step`, wrapping at both ends. */
export function stepOpenSector(
  ordered: Sector[],
  currentId: string | null,
  step: 1 | -1,
) {
  const open = ordered.filter(isOpen);
  if (open.length === 0) return null;
  const index = open.findIndex((sector) => sector.id === currentId);
  if (index === -1) return step === 1 ? open[0]! : open[open.length - 1]!;
  return open[(index + step + open.length) % open.length]!;
}

/** SVG path for an annular sector, with y pointing up (north) on screen. */
export function annularSectorPath(
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const toPoint = (radius: number, degrees: number) => {
    const radians = (degrees * Math.PI) / 180;
    return [radius * Math.cos(radians), -radius * Math.sin(radians)] as const;
  };
  const large = endAngle - startAngle > 180 ? 1 : 0;
  const [sx, sy] = toPoint(outerRadius, startAngle);
  const [ex, ey] = toPoint(outerRadius, endAngle);
  const [ix, iy] = toPoint(innerRadius, endAngle);
  const [jx, jy] = toPoint(innerRadius, startAngle);
  return [
    `M ${sx.toFixed(3)} ${sy.toFixed(3)}`,
    `A ${outerRadius} ${outerRadius} 0 ${large} 0 ${ex.toFixed(3)} ${ey.toFixed(3)}`,
    `L ${ix.toFixed(3)} ${iy.toFixed(3)}`,
    `A ${innerRadius} ${innerRadius} 0 ${large} 1 ${jx.toFixed(3)} ${jy.toFixed(3)}`,
    "Z",
  ].join(" ");
}
