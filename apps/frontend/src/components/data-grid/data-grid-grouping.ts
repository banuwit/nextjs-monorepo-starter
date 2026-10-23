/** Keep the current row order within each group, with groups in first-seen order. */
export function groupDataGridRows<T>(rows: T[], getKey: (row: T) => string) {
  const groups = new Map<string, T[]>();
  for (const row of rows) {
    const key = getKey(row);
    const group = groups.get(key);
    if (group) group.push(row);
    else groups.set(key, [row]);
  }
  return Array.from(groups, ([key, rows]) => ({ key, rows }));
}
