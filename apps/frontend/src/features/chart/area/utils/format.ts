// Formatting is done by hand instead of `Intl` compact notation: Node and
// browsers ship different ICU data, so the server and client can render
// different text (e.g. "$435.0K" vs "$435K") and cause hydration mismatches.
const compactUnits = [
  { value: 1e12, suffix: "T" },
  { value: 1e9, suffix: "B" },
  { value: 1e6, suffix: "M" },
  { value: 1e3, suffix: "K" },
] as const;

// One decimal at most, without a trailing ".0".
const round1 = (value: number) => Math.round(value * 10) / 10;

function compactAbs(value: number) {
  // Pick the unit after rounding so 999,960 becomes "1M", not "1000K".
  const unit = compactUnits.find((item) => round1(value / item.value) >= 1);
  return unit
    ? `${round1(value / unit.value)}${unit.suffix}`
    : `${round1(value)}`;
}

/** 1234 → "1.2K", 2500000 → "2.5M", 940 → "940". */
export function formatCompact(value: number) {
  return `${value < 0 ? "-" : ""}${compactAbs(Math.abs(value))}`;
}

/** 435000 → "$435K", -1200 → "-$1.2K". */
export function formatCurrency(value: number) {
  return `${value < 0 ? "-" : ""}$${compactAbs(Math.abs(value))}`;
}

export function sumBy<T>(rows: readonly T[], pick: (row: T) => number) {
  return rows.reduce((total, row) => total + pick(row), 0);
}
