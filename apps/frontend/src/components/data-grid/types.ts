import type { SortingState } from "@tanstack/react-table"

import type {
  FilterOption,
  FilterSelectionVariant,
  SelectOption,
} from "@/components/filter/types"

/**
 * Query string shape shared by every server-driven list page.
 */
export type DataGridFilters = {
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: string
  pageSize?: string
  [key: string]: string | string[] | undefined
}

/** Pagination metadata from the locked REST list envelope. */
export interface DataGridPageMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/** A facet's options are plain filter options — see `@/components/filter`. */
export type FacetOption = FilterOption

export interface FacetConfig {
  key: string
  title: string
  options: FacetOption[]
  variant?: FilterSelectionVariant
}

export interface SearchConfig {
  key: string
  placeholder: string
}

/** A short single-pick list rendered as a `SelectFilter` (no search). */
export interface DropdownConfig {
  key: string
  placeholder: string
  /** Options with a `group` render under that heading; long lists scroll. */
  options: SelectOption[]
  /** Label of the entry that clears the filter. Default: "All". */
  allLabel?: string
}

/** A long list rendered as a searchable `ComboboxFilter`. */
export interface ComboboxConfig {
  key: string
  placeholder: string
  options: SelectOption[]
  emptyMessage?: string
  /** Allow several picks (chips, or a count badge with `trigger="popup"`). */
  multiple?: boolean
  /** `"popup"` opens the search box from a button. Default: `"input"`. */
  trigger?: "input" | "popup"
  searchPlaceholder?: string
}

export interface ToolbarConfig {
  searches?: SearchConfig[]
  facets?: FacetConfig[]
  dropdowns?: DropdownConfig[]
  comboboxes?: ComboboxConfig[]
}

export function getSorted(
  sorting: SortingState,
  columnId: string,
): false | "asc" | "desc" {
  const entry = sorting.find((sort) => sort.id === columnId)

  if (!entry) {
    return false
  }

  return entry.desc ? "desc" : "asc"
}
