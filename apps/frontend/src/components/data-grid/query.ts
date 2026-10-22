export type GridQueryValue = string | number | string[] | undefined
export type GridQuery = Record<string, GridQueryValue>

/** Build a shareable list URL from resolved filters plus the next table action. */
export function buildDataGridUrl(
  pathname: string,
  filters: GridQuery,
  changes: GridQuery,
  defaults: GridQuery = {},
) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries({ ...filters, ...changes })) {
    if (
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0) ||
      String(value) === String(defaults[key]) ||
      (key === "page" && String(value) === "1")
    ) {
      continue
    }

    for (const item of Array.isArray(value) ? value : [value]) {
      params.append(key, String(item))
    }
  }

  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}
