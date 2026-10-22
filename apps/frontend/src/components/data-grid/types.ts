import type { SortingState } from "@tanstack/react-table"

import type {
  FilterOption,
  FilterSelectionVariant,
  SelectOption,
} from "@/components/filters/types"

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

/** A facet's options are plain filter options — see `@/components/filters`. */
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

/**
 * A single-pick filter rendered as a `SelectBox` instead of a `FacetedFilter`
 * — the choice applies immediately, no Apply step. Server-side query values
 * use repeated keys, like faceted filters.
 */
export interface SelectConfig {
  key: string
  placeholder?: string
  options: SelectOption[]
  clearable?: boolean
}

export interface ToolbarConfig {
  searches?: SearchConfig[]
  facets?: FacetConfig[]
  selects?: SelectConfig[]
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
