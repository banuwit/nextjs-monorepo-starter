import type { User } from "@/mocks/user.mock";
import type { UserCellSorting, UserFilter } from "../types/user-sheet-filters";

/** Sort the same rows used by clipboard coordinates, without mutating history. */
export function sortUserCells(rows: User[], sorting: UserCellSorting) {
  if (!sorting) return rows;
  if (sorting.field === "no") return sorting.desc ? [...rows].reverse() : rows;
  const field = sorting.field;
  return [...rows].sort(
    (a, b) =>
      a[field].localeCompare(b[field], "en", {
        numeric: true,
        sensitivity: "base",
      }) * (sorting.desc ? -1 : 1),
  );
}

export function filterUserCells(rows: User[], filters: UserFilter[]) {
  return rows.filter((row, index) =>
    filters.every(({ field, operator, value }) => {
      if (!value.trim()) return true;
      const actual = (
        field === "no" ? String(index + 1) : row[field]
      ).toLowerCase();
      const expected = value.trim().toLowerCase();
      switch (operator) {
        case "contains":
          return actual.includes(expected);
        case "equals":
          return actual === expected;
        case "not":
          return actual !== expected;
        case "before":
          return field === "no"
            ? Number(actual) < Number(expected)
            : actual < expected;
        case "after":
          return field === "no"
            ? Number(actual) > Number(expected)
            : actual > expected;
      }
    }),
  );
}
