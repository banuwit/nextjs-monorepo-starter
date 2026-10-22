"use client"

import { useTable } from "@tanstack/react-table"
import type {
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  ColumnVisibilityState,
  RowData,
  SortingState,
} from "@tanstack/react-table"
import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { FacetedFilter } from "@/components/filters/faceted-filter"
import { SelectBox } from "@/components/filters/select-box"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "./constants"
import { DataGridEmpty } from "./data-grid-empty"
import { DataGridError } from "./data-grid-error"
import { features } from "./data-grid-features"
import type { DataGridFeatures } from "./data-grid-features"
import { DataGridLoading } from "./data-grid-loading"
import { DataGridPaginationAdvance } from "./data-grid-pagination-advance"
import { DataGridPaginationSimple } from "./data-grid-pagination-simple"
import { getPinnedCellProps, useColumnPinOffsets } from "./data-grid-pinning"
import { DataGridSearchInput } from "./data-grid-search-input"
import { getDataGridBodyState } from "./data-grid-state"
import { DataGridVisibilityToggle } from "./data-grid-visibility-toggle"
import { buildDataGridUrl } from "./query"
import type { GridQuery } from "./query"
import type { DataGridFilters, DataGridPageMeta, ToolbarConfig } from "./types"

/**
 * Query defaults the API already applies. Params matching a default are
 * dropped from the URL so the address bar stays clean.
 */
export interface DataGridServerDefaults {
  sortBy?: string
  sortOrder?: "asc" | "desc"
  pageSize?: number
}

interface DataGridServerBaseProps<TData extends RowData> {
  columns: ColumnDef<DataGridFeatures, TData>[]
  /** Resolved query parameters from the page's `searchParams`. */
  filters: DataGridFilters
  /** Pathname tujuan, mis. `/users`. Default: pathname saat ini. */
  url?: string
  toolbar?: ToolbarConfig
  /** Extra buttons rendered to the right of the visibility toggle. */
  actions?: React.ReactNode
  /** Hide the toolbar's column visibility toggle. Default: true. */
  showVisibilityToggle?: boolean
  /**
   * Show the "View columns" submenu inside every `DataGridHeaderDropdown`.
   * Default: true. A column can still override it per header.
   */
  showHeaderVisibilityToggle?: boolean
  /**
   * Add "Pin to left" / "Pin to right" to the header dropdown and make
   * pinned columns sticky while the grid scrolls sideways. Default: false.
   */
  enableColumnPinning?: boolean
  /**
   * Add "Move to left" / "Move to right" to the header dropdown.
   * Default: false.
   */
  enableColumnOrdering?: boolean
  /**
   * Columns pinned on first render, e.g. `{ start: [], end: ['actions'] }`.
   * Use this for label-only headers, which have no dropdown to pin from.
   */
  defaultColumnPinning?: ColumnPinningState
  /** Column ids in their initial order. Defaults to the column def order. */
  defaultColumnOrder?: ColumnOrderState
  /**
   * Stable row id, e.g. `(row) => String(row.id)`. Without this, TanStack
   * falls back to the row's index as its id — after a delete or a page/sort
   * change, a row's index gets reused by a *different* record, and any
   * row-local React state (an open menu, a confirmation dialog) leaks onto
   * it instead of resetting. Always pass this when rows have a stable id.
   */
  getRowId?: (row: TData, index: number) => string
  defaults?: DataGridServerDefaults
  /** Pagination style, or `none` to hide it (e.g. the query returns every row already). Default: `advance`. */
  pagination?: "advance" | "simple" | "none"
  /** Shown when there are no rows and no search/facet is active. */
  emptyTitle?: string
  emptyDescription?: string
  /** Shown when there are no rows while a search or facet is active. Falls back to `emptyTitle`/`emptyDescription` when omitted. */
  emptyFilteredTitle?: string
  emptyFilteredDescription?: string
}

export type DataGridServerProps<TData extends RowData> =
  DataGridServerBaseProps<TData> &
    (
      | { data: TData[]; meta: DataGridPageMeta; error?: never }
      | { error: string; data?: never; meta?: never }
    )

const EMPTY_META: DataGridPageMeta = {
  page: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  totalPages: 1,
}

function ServerSearch({
  initialValue,
  placeholder,
  onSearch,
}: {
  initialValue: string
  placeholder: string
  onSearch: (value: string) => void
}) {
  const [value, setValue] = React.useState(initialValue)
  const timeout = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSearchRef = React.useRef(onSearch)

  React.useEffect(() => {
    onSearchRef.current = onSearch
  }, [onSearch])

  React.useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    [],
  )

  return (
    <DataGridSearchInput
      placeholder={placeholder}
      value={value}
      onChange={(next) => {
        setValue(next)
        if (timeout.current) clearTimeout(timeout.current)
        timeout.current = setTimeout(
          () => onSearchRef.current(next),
          SEARCH_DEBOUNCE_MS,
        )
      }}
    />
  )
}

export function DataGridServer<TData extends RowData>({
  columns,
  data = [],
  meta = EMPTY_META,
  error,
  filters,
  url,
  toolbar,
  actions,
  showVisibilityToggle = true,
  showHeaderVisibilityToggle = true,
  enableColumnPinning = false,
  enableColumnOrdering = false,
  defaultColumnPinning,
  defaultColumnOrder,
  getRowId,
  defaults = {},
  pagination = "advance",
  emptyTitle,
  emptyDescription,
  emptyFilteredTitle,
  emptyFilteredDescription,
}: DataGridServerProps<TData>) {
  const facets = toolbar?.facets ?? []
  const selects = toolbar?.selects ?? []
  const searchConfigs = toolbar?.searches ?? []

  // True when a search box, facet, or select is currently narrowing the
  // result set — distinguishes "no rows in this filter" from "no rows at
  // all" in the empty state.
  const isFiltered =
    searchConfigs.some((search) => !!filters[search.key]) ||
    [...facets, ...selects].some((filter) => {
      const value = filters[filter.key]

      return Array.isArray(value) ? value.length > 0 : !!value
    })

  const { pageSize: defaultPageSize = PAGE_SIZE } = defaults

  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    () => defaultColumnPinning ?? { start: [], end: [] },
  )
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    () => defaultColumnOrder ?? [],
  )

  const sorting: SortingState = filters.sortBy
    ? [{ id: filters.sortBy, desc: filters.sortOrder !== "asc" }]
    : []

  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  // Setiap kunjungan mengirim ulang seluruh filter yang sedang aktif — query
  // string adalah satu-satunya sumber kebenaran, jadi param yang tidak
  // disertakan berarti dihapus.
  const visit = React.useCallback(
    (overrides: GridQuery) => {
      const target = buildDataGridUrl(
        url ?? pathname,
        {
          ...filters,
          page: meta.page,
        },
        overrides,
        { pageSize: defaultPageSize, ...defaults },
      )
      startTransition(() => router.push(target, { scroll: false }))
    },
    [url, pathname, filters, meta.page, defaultPageSize, defaults, router],
  )

  const table = useTable({
    features,
    data,
    columns,
    getRowId,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: meta.total,
    enableSortingRemoval: false,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      const sort = next[0]

      visit({
        sortBy: sort?.id,
        sortOrder: sort ? (sort.desc ? "desc" : "asc") : undefined,
        page: 1,
      })
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: setColumnOrder,
    enableColumnPinning,
    meta: {
      enableColumnPinning,
      enableColumnOrdering,
      showHeaderVisibilityToggle,
    },
    state: {
      sorting,
      columnVisibility,
      columnPinning,
      columnOrder,
      pagination: {
        pageIndex: meta.page - 1,
        pageSize: meta.pageSize,
      },
    },
  })

  const { registerHeader, offsets } = useColumnPinOffsets(
    table.getPinnedVisibleLeafColumns("start").map((column) => column.id),
    table.getPinnedVisibleLeafColumns("end").map((column) => column.id),
  )

  const bodyState = getDataGridBodyState({
    error,
    pending: isPending,
    rowCount: table.getRowModel().rows.length,
  })

  return (
    <div className="flex flex-col gap-3">
      {(toolbar || showVisibilityToggle || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {searchConfigs.map((search) => (
              <ServerSearch
                key={`${search.key}:${filters[search.key] ?? ""}`}
                placeholder={search.placeholder}
                initialValue={String(filters[search.key] ?? "")}
                onSearch={(value) => visit({ [search.key]: value, page: 1 })}
              />
            ))}
            {facets.map((facet) => {
              const applied = filters[facet.key]

              return (
                <FacetedFilter
                  key={facet.key}
                  title={facet.title}
                  options={facet.options}
                  variant={facet.variant}
                  appliedValues={
                    Array.isArray(applied) ? applied : applied ? [applied] : []
                  }
                  onApply={(values) => visit({ [facet.key]: values, page: 1 })}
                  onClear={() =>
                    visit({
                      [facet.key]: undefined,
                      page: 1,
                    })
                  }
                />
              )
            })}
            {selects.map((select) => {
              const applied = filters[select.key]
              const value = Array.isArray(applied)
                ? (applied[0] ?? null)
                : (applied ?? null)

              return (
                <SelectBox
                  key={select.key}
                  // `SelectBox` defaults its trigger to
                  // `w-full` for its form-control use case;
                  // here it sits beside `FacetedFilter`
                  // triggers, which shrink to their content,
                  // so it needs the same to look consistent.
                  className="w-auto"
                  options={select.options}
                  placeholder={select.placeholder}
                  clearable={select.clearable}
                  value={value}
                  onValueChange={(next) =>
                    visit({
                      [select.key]: next ?? undefined,
                      page: 1,
                    })
                  }
                />
              )
            })}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {showVisibilityToggle && (
              <DataGridVisibilityToggle
                table={table}
                columnVisibility={columnVisibility}
              />
            )}
            {actions}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    ref={registerHeader(header.column.id)}
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : "none"
                    }
                    {...getPinnedCellProps(
                      header.column.getIsPinned(),
                      offsets,
                      header.column.id,
                      { isHeader: true },
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {bodyState === "error" ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="p-0"
                >
                  <DataGridError
                    message={error || "Could not load data."}
                    onRetry={() => router.refresh()}
                  />
                </TableCell>
              </TableRow>
            ) : bodyState === "loading" ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="p-0"
                >
                  <DataGridLoading />
                </TableCell>
              </TableRow>
            ) : bodyState === "rows" ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group/row">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      {...getPinnedCellProps(
                        cell.column.getIsPinned(),
                        offsets,
                        cell.column.id,
                      )}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="p-0"
                >
                  <DataGridEmpty
                    title={
                      isFiltered
                        ? (emptyFilteredTitle ?? emptyTitle)
                        : emptyTitle
                    }
                    description={
                      isFiltered
                        ? (emptyFilteredDescription ?? emptyDescription)
                        : emptyDescription
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {bodyState !== "error" &&
        bodyState !== "loading" &&
        pagination === "advance" && (
          <DataGridPaginationAdvance
            server={{
              total: meta.total,
              from: meta.total ? (meta.page - 1) * meta.pageSize + 1 : 0,
              to: Math.min(meta.page * meta.pageSize, meta.total),
              currentPage: meta.page,
              lastPage: meta.totalPages,
              perPage: meta.pageSize,
              canPrev: meta.page > 1,
              canNext: meta.page < meta.totalPages,
              onFirst: () => visit({ page: 1 }),
              onPrev: () => visit({ page: meta.page - 1 }),
              onNext: () => visit({ page: meta.page + 1 }),
              onLast: () => visit({ page: meta.totalPages }),
              onPageSizeChange: (size) => visit({ pageSize: size, page: 1 }),
            }}
          />
        )}
      {bodyState !== "error" &&
        bodyState !== "loading" &&
        pagination === "simple" && (
          <DataGridPaginationSimple
            server={{
              total: meta.total,
              from: meta.total ? (meta.page - 1) * meta.pageSize + 1 : 0,
              to: Math.min(meta.page * meta.pageSize, meta.total),
              currentPage: meta.page,
              lastPage: meta.totalPages,
              canPrev: meta.page > 1,
              canNext: meta.page < meta.totalPages,
              onPrev: () => visit({ page: meta.page - 1 }),
              onNext: () => visit({ page: meta.page + 1 }),
            }}
          />
        )}
    </div>
  )
}
