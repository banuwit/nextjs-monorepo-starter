"use client"

import { useTable } from "@tanstack/react-table"
import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnVisibilityState,
  PaginationState,
  RowData,
  SortingState,
} from "@tanstack/react-table"
import * as React from "react"

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

import { PAGE_SIZE } from "./constants"
import { DataGridColumnDnd, DataGridSortableColumnHead, getColumnMotionStyle } from "./data-grid-column-dnd"
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
import { DataGridRowDnd, DataGridSortableRow } from "./data-grid-row-dnd"
import { reorderDataGridItems } from "./data-grid-reordering"
import { DataGridVisibilityToggle } from "./data-grid-visibility-toggle"
import type { ToolbarConfig } from "./types"

interface DataGridClientBaseProps<TData extends RowData> {
  columns: ColumnDef<DataGridFeatures, TData>[]
  data: TData[]
  /** Omit for a plain grid with sorting only — no search or filter. */
  toolbar?: ToolbarConfig
  defaultSorting?: SortingState
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
  /** Drag ungrouped DataGridHeaderDrag headers. Pinned columns remain fixed. */
  columnDrag?: {
    order: ColumnOrderState
    onOrderChange: (order: ColumnOrderState) => void
  }
  /**
   * Stable row id, e.g. `(row) => String(row.id)`. Without this, TanStack
   * falls back to the row's index as its id — after a delete, sort, or
   * filter change, a row's index gets reused by a *different* record, and
   * any row-local React state (an open menu, a confirmation dialog) leaks
   * onto it instead of resetting. Always pass this when rows have a stable id.
   */
  getRowId?: (row: TData, index: number) => string
  /** Show a loading skeleton while a local data request is in flight. */
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyFilteredTitle?: string
  emptyFilteredDescription?: string
  /** Pagination style, or `none` to render every row. Default: `advance`. */
  pagination?: "advance" | "simple" | "none"
}

export type DataGridClientProps<TData extends RowData> =
  DataGridClientBaseProps<TData> &
    (
      | { onRowReorder?: never }
      | {
          /** Enables manual ordering; the caller updates its data by stable IDs. */
          onRowReorder: (activeId: string, overId: string) => void
          getRowId: (row: TData, index: number) => string
          defaultSorting?: never
        }
    ) &
    (
      | { error?: never; onRetry?: never }
      | { error: string; onRetry: () => void }
    )

const EMPTY_FACETS: NonNullable<ToolbarConfig["facets"]> = []
const EMPTY_SELECTS: NonNullable<ToolbarConfig["selects"]> = []

export function DataGridClient<TData extends RowData>({
  columns,
  data,
  toolbar,
  defaultSorting = [],
  actions,
  showVisibilityToggle = true,
  showHeaderVisibilityToggle = true,
  enableColumnPinning = false,
  enableColumnOrdering = false,
  defaultColumnPinning,
  defaultColumnOrder,
  columnDrag,
  getRowId,
  loading = false,
  emptyTitle,
  emptyDescription,
  emptyFilteredTitle,
  emptyFilteredDescription,
  pagination = "advance",
  error,
  onRetry,
  onRowReorder,
}: DataGridClientProps<TData>) {
  const facets = toolbar?.facets ?? EMPTY_FACETS
  const selects = toolbar?.selects ?? EMPTY_SELECTS
  const searchConfigs = toolbar?.searches ?? []
  const paginate = pagination !== "none"

  // Facets/selects carry arrays; TanStack's automatic string filter does not
  // interpret those as a set of allowed values.
  const filterColumns = React.useMemo(() => {
    const multiValueKeys = new Set(
      [...facets, ...selects].map((filter) => filter.key),
    )
    const configure = (
      column: ColumnDef<DataGridFeatures, TData>,
    ): ColumnDef<DataGridFeatures, TData> => {
      if ("columns" in column && column.columns) {
        return { ...column, columns: column.columns.map(configure) }
      }
      const id =
        column.id ??
        ("accessorKey" in column ? String(column.accessorKey) : undefined)
      return id && multiValueKeys.has(id)
        ? { ...column, filterFn: "multiValue" }
        : column
    }
    return columns.map(configure)
  }, [columns, facets, selects])

  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    () => defaultColumnPinning ?? { start: [], end: [] },
  )
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    () => defaultColumnOrder ?? [],
  )
  const [paginationState, setPaginationState] = React.useState<PaginationState>(
    {
      pageIndex: 0,
      pageSize: PAGE_SIZE,
    },
  )

  const table = useTable({
    features,
    data,
    columns: filterColumns,
    getRowId,
    enableSorting: !onRowReorder,
    enableSortingRemoval: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onColumnOrderChange: columnDrag
      ? (updater) => columnDrag.onOrderChange(
          typeof updater === "function" ? updater(columnDrag.order) : updater,
        )
      : setColumnOrder,
    onPaginationChange: setPaginationState,
    enableColumnPinning,
    meta: {
      enableColumnPinning,
      enableColumnOrdering,
      showHeaderVisibilityToggle,
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnPinning,
      columnOrder: columnDrag?.order ?? columnOrder,
      pagination: paginationState,
    },
  })

  const { registerHeader, offsets } = useColumnPinOffsets(
    table.getPinnedVisibleLeafColumns("start").map((column) => column.id),
    table.getPinnedVisibleLeafColumns("end").map((column) => column.id),
  )

  const resetPage = () => {
    setPaginationState((current) => ({ ...current, pageIndex: 0 }))
  }

  const handleSearch = (key: string, value: string) => {
    table.getColumn(key)?.setFilterValue(value || undefined)
    resetPage()
  }

  const getSearchValue = (key: string) =>
    (columnFilters.find((filter) => filter.id === key)?.value as string) ?? ""

  const getFacetValues = (key: string) => {
    const applied = columnFilters.find((filter) => filter.id === key)?.value

    return Array.isArray(applied) ? (applied as string[]) : []
  }

  const applyFacet = (key: string, values: string[]) => {
    table.getColumn(key)?.setFilterValue(values.length ? values : undefined)
    resetPage()
  }

  // `getRowModel()` returns the paginated slice; when pagination is off,
  // read the pre-pagination (filtered + sorted) rows instead so every row
  // renders.
  const rows = paginate
    ? table.getRowModel().rows
    : table.getSortedRowModel().rows
  const bodyState = getDataGridBodyState({
    error,
    pending: loading,
    rowCount: rows.length,
  })
  const draggableColumns = columnDrag && table.getHeaderGroups().length === 1
    ? table.getPinnedVisibleLeafColumns("center").map((column) => column.id)
    : []

  const content = (
    <div className="flex flex-col gap-3">
      {(toolbar || showVisibilityToggle || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {searchConfigs.map((search) => (
              <DataGridSearchInput
                key={search.key}
                placeholder={search.placeholder}
                value={getSearchValue(search.key)}
                onChange={(value) => handleSearch(search.key, value)}
              />
            ))}
            {facets.map((facet) => (
              <FacetedFilter
                key={facet.key}
                title={facet.title}
                options={facet.options}
                variant={facet.variant}
                appliedValues={getFacetValues(facet.key)}
                onApply={(values) => applyFacet(facet.key, values)}
                onClear={() => applyFacet(facet.key, [])}
              />
            ))}
            {selects.map((select) => (
              <SelectBox
                key={select.key}
                className="w-auto"
                options={select.options}
                placeholder={select.placeholder}
                clearable={select.clearable}
                value={getFacetValues(select.key)[0] ?? null}
                onValueChange={(value) =>
                  applyFacet(select.key, value ? [value] : [])
                }
              />
            ))}
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
                {headerGroup.headers.map((header) => {
                  const columnIndex = draggableColumns.indexOf(header.column.id)
                  const headerProps = {
                    colSpan: header.colSpan,
                    "aria-sort": header.column.getIsSorted() === "asc"
                      ? "ascending" as const
                      : header.column.getIsSorted() === "desc"
                        ? "descending" as const
                        : "none" as const,
                    ...getPinnedCellProps(
                      header.column.getIsPinned(), offsets, header.column.id,
                      { isHeader: true },
                    ),
                  }
                  const label = header.isPlaceholder ? null : <table.FlexRender header={header} />

                  return columnIndex >= 0 ? (
                    <DataGridSortableColumnHead
                      key={header.id}
                      {...headerProps}
                      columnId={header.column.id}
                      columnIndex={columnIndex}
                      headerRef={registerHeader(header.column.id)}
                    >
                      {label}
                    </DataGridSortableColumnHead>
                  ) : (
                    <TableHead key={header.id} {...headerProps} ref={registerHeader(header.column.id)}>
                      {label}
                    </TableHead>
                  )
                })}
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
                    onRetry={onRetry}
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
              rows.map((row) => {
                const cells = row.getVisibleCells().map((cell) => {
                  const columnIndex = draggableColumns.indexOf(cell.column.id)
                  return (
                    <TableCell
                      key={cell.id}
                      {...getPinnedCellProps(
                        cell.column.getIsPinned(), offsets, cell.column.id,
                      )}
                      {...(columnIndex >= 0 ? {
                        "data-column-id": cell.column.id,
                        style: getColumnMotionStyle(columnIndex),
                        className: "motion-reduce:transition-none!",
                      } : {})}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  )
                })

                return onRowReorder ? (
                  <DataGridSortableRow key={row.id} id={row.id}>
                    {cells}
                  </DataGridSortableRow>
                ) : (
                  <TableRow key={row.id} className="group/row">
                    {cells}
                  </TableRow>
                )
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="p-0"
                >
                  <DataGridEmpty
                    title={data.length === 0 ? emptyTitle : emptyFilteredTitle}
                    description={
                      data.length === 0
                        ? emptyDescription
                        : emptyFilteredDescription
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
        paginate &&
        pagination === "advance" && (
          <DataGridPaginationAdvance
            table={table}
            pagination={paginationState}
          />
        )}
      {bodyState !== "error" &&
        bodyState !== "loading" &&
        paginate &&
        pagination === "simple" && (
          <DataGridPaginationSimple
            table={table}
            pagination={paginationState}
          />
        )}
    </div>
  )

  const grid = columnDrag ? (
    <DataGridColumnDnd
      items={draggableColumns}
      onReorder={(activeId, overId) => {
        const order = table.getAllLeafColumns().map((column) => column.id)
        table.setColumnOrder(reorderDataGridItems(order, activeId, overId, (id) => id))
      }}
    >
      {content}
    </DataGridColumnDnd>
  ) : content

  return onRowReorder ? (
    <DataGridRowDnd
      items={bodyState === "rows" ? rows.map((row) => row.id) : []}
      onReorder={onRowReorder}
    >
      {grid}
    </DataGridRowDnd>
  ) : grid
}
