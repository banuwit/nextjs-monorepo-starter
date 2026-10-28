/** Adds step conversion (vs previous stage) and overall conversion (vs first). */
export function withConversion<T>(
  rows: readonly T[],
  pick: (row: T) => number,
) {
  const first = rows[0] ? pick(rows[0]) : 0;

  return rows.map((row, index) => {
    const value = pick(row);
    const previous = index > 0 ? pick(rows[index - 1]!) : value;
    return {
      ...row,
      value,
      dropOff: previous - value,
      stepRate: previous ? (value / previous) * 100 : 0,
      overallRate: first ? (value / first) * 100 : 0,
    };
  });
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}
