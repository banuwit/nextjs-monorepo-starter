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
  ReactTable,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table"
import * as React from "react"
import { cn } from "@/lib/utils"

import { FacetedFilter } from "@/components/filter/faceted-filter"
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
import { groupDataGridRows } from "./data-grid-grouping"
import { DataGridError } from "./data-grid-error"
import { features } from "./data-grid-features"
import type { DataGridFeatures } from "./data-grid-features"
import { DataGridLoading } from "./data-grid-loading"
import { DataGridPaginationAdvance } from "./data-grid-pagination-advance"
import { DataGridPaginationSimple } from "./data-grid-pagination-simple"
import { getPinnedCellProps, useColumnPinOffsets } from "./data-grid-pinning"
import { DataGridSearchInput } from "./data-grid-search-input"
import {
  DataGridToolbarFilters,
  getToolbarFilterKeys,
} from "./data-grid-toolbar-filters"
import { getDataGridBodyState } from "./data-grid-state"
import { DataGridRowDnd, DataGridSortableRow } from "./data-grid-row-dnd"
import { reorderDataGridItems } from "./data-grid-reordering"
import { DataGridVisibilityToggle } from "./data-grid-visibility-toggle"
import { DataGridVirtualRows, type DataGridVirtualScroll } from "./data-grid-virtual-rows"
import { DataGridScrollArea } from "./data-grid-scroll-area"
import type { ToolbarConfig } from "./types"

export interface DataGridColumnState {
  visibility: ColumnVisibilityState
  order: ColumnOrderState
  pinning: ColumnPinningState
  onVisibilityChange: OnChangeFn<ColumnVisibilityState>
  onOrderChange: OnChangeFn<ColumnOrderState>
  onPinningChange: OnChangeFn<ColumnPinningState>
}

interface DataGridClientBaseProps<TData extends RowData> {
  columns: ColumnDef<DataGridFeatures, TData>[]
  data: TData[]
  /** Detail content beneath a parent row; return null when collapsed. */
  renderRowDetails?: (row: TData) => React.ReactNode
  /** Group the current row view inside one table. Use pagination="none" for complete groups. */
  rowGrouping?: {
    getKey: (row: TData) => string
    renderHeader: (context: { key: string; rows: TData[] }) => React.ReactNode
    isCollapsed?: (key: string) => boolean
  }
  defaultPageSize?: number
  pageSizeOptions?: number[]
  /** Optional accessibility attributes for interactive grids. */
  tableProps?: React.ComponentProps<"table">
  getHeaderProps?: (columnId: string) => React.ComponentProps<"th">
  /** Row semantics and keyboard interaction for feature-owned tree views. */
  getRowProps?: (row: TData) => React.ComponentProps<"tr">
  /** Cell interaction and appearance; shared rendering/pinning stays in the grid. */
  getCellProps?: (context: {
    row: TData
    rowIndex: number
    columnId: string
  }) => React.ComponentProps<"td">
  /** Omit for a plain grid with sorting only — no search or filter. */
  toolbar?: ToolbarConfig
  /** Feature-owned column state keeps spreadsheet coordinates aligned with the view. */
  columnState?: DataGridColumnState
  /** Replace the default toolbar while using the same table instance. */
  renderToolbar?: (table: ReactTable<DataGridFeatures, TData>) => React.ReactNode
  defaultSorting?: SortingState
  /** Extra buttons rendered to the right of the visibility toggle. */
  actions?: React.ReactNode
  /** Hide the toolbar's column visibility toggle. Default: true. */
  showVisibilityToggle?: boolean
  /** Use compact row spacing. Default: true. */
  compact?: boolean
  /** Shade alternating data rows. Default: false. */
  striped?: boolean
  /** Draw separators between columns. Default: false. */
  columnLines?: boolean
  /** Draw the table's own rounded border. Turn off when the grid sits flush inside a framed card. Default: true. */
  bordered?: boolean
  /** Keep the header visible in a scroll viewport. Defaults to true for virtual scroll, false otherwise. */
  stickyHeader?: boolean
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
  /** Drag ungrouped DataGridHeaderDnd headers. Pinned columns remain fixed. */
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
  /** Flat, unpaginated rows only; not combined with row grouping, details or drag-and-drop. */
  virtualScroll?: DataGridVirtualScroll
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

export function DataGridClient<TData extends RowData>({
  columns,
  data,
  renderRowDetails,
  rowGrouping,
  defaultPageSize = PAGE_SIZE,
  pageSizeOptions,
  tableProps,
  getHeaderProps,
  getRowProps,
  getCellProps,
  toolbar,
  columnState,
  renderToolbar,
  defaultSorting = [],
  actions,
  showVisibilityToggle = true,
  compact = true,
  striped = false,
  columnLines = false,
  bordered = true,
  stickyHeader,
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
  virtualScroll,
  error,
  onRetry,
  onRowReorder,
}: DataGridClientProps<TData>) {
  const facets = toolbar?.facets ?? EMPTY_FACETS
  const searchConfigs = toolbar?.searches ?? []
  const toolbarFilterKeys = getToolbarFilterKeys(toolbar).join("\n")
  const paginate = pagination !== "none"
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const useVirtualRows = !!virtualScroll && !paginate && !rowGrouping && !renderRowDetails && !onRowReorder && !columnDrag
  const useStickyHeader = stickyHeader ?? useVirtualRows

  // Facets carry arrays; TanStack's automatic string filter does not
  // interpret those as a set of allowed values.
  const filterColumns = React.useMemo(() => {
    const multiValueKeys = new Set(
      [
        ...facets.map((filter) => filter.key),
        ...(toolbarFilterKeys ? toolbarFilterKeys.split("\n") : []),
      ],
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
  }, [columns, facets, toolbarFilterKeys])

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
      pageSize: defaultPageSize,
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
    onColumnVisibilityChange: columnState?.onVisibilityChange ?? setColumnVisibility,
    onColumnPinningChange: columnState?.onPinningChange ?? setColumnPinning,
    onColumnOrderChange: columnDrag
      ? (updater) => columnDrag.onOrderChange(
          typeof updater === "function" ? updater(columnDrag.order) : updater,
        )
      : columnState?.onOrderChange ?? setColumnOrder,
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
      columnVisibility: columnState?.visibility ?? columnVisibility,
      columnPinning: columnState?.pinning ?? columnPinning,
      columnOrder: columnDrag?.order ?? columnState?.order ?? columnOrder,
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

  const renderRow = (row: (typeof rows)[number], virtualProps?: React.ComponentProps<"tr">) => {
    const cells = row.getVisibleCells().map((cell) => {
      const columnIndex = draggableColumns.indexOf(cell.column.id)
      const pinnedProps = getPinnedCellProps(
        cell.column.getIsPinned(), offsets, cell.column.id,
      )
      const customProps = getCellProps?.({
        row: row.original, rowIndex: row.index, columnId: cell.column.id,
      })
      return (
        <TableCell
          key={cell.id}
          {...customProps}
          {...(columnIndex >= 0 ? {
            "data-column-id": cell.column.id,
          } : {})}
          className={cn(pinnedProps.className, !compact && "py-3.5", columnIndex >= 0 && "motion-reduce:transition-none!", customProps?.className, cell.column.getIsPinned() && "sticky", cell.column.getIsPinned() && customProps?.["aria-selected"] === true && "bg-[color-mix(in_srgb,var(--primary)_10%,var(--background))]")}
          style={{ ...customProps?.style, ...pinnedProps.style, ...(columnIndex >= 0 ? getColumnMotionStyle(columnIndex) : {}) }}
        >
          <table.FlexRender cell={cell} />
        </TableCell>
      )
    })

    const rowProps = getRowProps?.(row.original)
    const parentRow = onRowReorder ? (
      <DataGridSortableRow key={row.id} id={row.id}>
        {cells}
      </DataGridSortableRow>
    ) : (
      <TableRow key={row.id} {...rowProps} {...virtualProps} className={cn("group/row", striped && row.index % 2 === 1 && "bg-muted/30", rowProps?.className)}>
        {cells}
      </TableRow>
    )
    const details = renderRowDetails?.(row.original)

    return (
      <React.Fragment key={row.id}>
        {parentRow}
        {details != null && details !== false && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={table.getVisibleLeafColumns().length} className="whitespace-normal bg-muted/30 p-0">
              {details}
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    )
  }

  const content = (
    <div className="flex flex-col gap-3">
      {renderToolbar ? renderToolbar(table) : (toolbar || showVisibilityToggle || actions) && (
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
            <DataGridToolbarFilters
              toolbar={toolbar}
              getValues={getFacetValues}
              onChange={applyFacet}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {showVisibilityToggle && (
              <DataGridVisibilityToggle
                table={table}
                columnVisibility={columnState?.visibility ?? columnVisibility}
              />
            )}
            {actions}
          </div>
        </div>
      )}

      <div className={cn("overflow-hidden", bordered && "rounded-md border")}>
        <Table {...tableProps} className={cn(columnLines && "[&_th:not(:last-child)]:border-r [&_td:not(:last-child)]:border-r", tableProps?.className)} aria-rowcount={useVirtualRows ? virtualScroll!.totalCount + 1 : tableProps?.["aria-rowcount"]}
          renderContainer={useVirtualRows || useStickyHeader ? (children) => (
            <DataGridScrollArea
              scrollRef={scrollRef}
              label={virtualScroll?.label ?? tableProps?.["aria-label"] ?? "Scrollable data grid"}
              height={virtualScroll?.height ?? "min(35rem, 65vh)"}
              stickyHeader={useStickyHeader}
            >
              {children}
            </DataGridScrollArea>
          ) : undefined}>
          <TableHeader className={cn("bg-muted", useStickyHeader && "sticky top-0 z-20")}>
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
                  const customHeaderProps = getHeaderProps?.(header.column.id)

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
                    <TableHead key={header.id} {...headerProps} {...customHeaderProps} className={cn(headerProps.className, customHeaderProps?.className)} style={{...headerProps.style, ...customHeaderProps?.style}} ref={registerHeader(header.column.id)}>
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
              useVirtualRows ? <DataGridVirtualRows rows={rows} colSpan={table.getVisibleLeafColumns().length} scrollRef={scrollRef} options={virtualScroll!} renderRow={renderRow} /> : rowGrouping ? groupDataGridRows(rows, (row) => rowGrouping.getKey(row.original)).map((group) => (
                <React.Fragment key={group.key}>
                  <TableRow data-row-group={group.key} className="hover:bg-transparent">
                    <TableCell colSpan={table.getVisibleLeafColumns().length} className="p-0">
                      {rowGrouping.renderHeader({ key: group.key, rows: group.rows.map((row) => row.original) })}
                    </TableCell>
                  </TableRow>
                  {!rowGrouping.isCollapsed?.(group.key) && group.rows.map((row) => renderRow(row))}
                </React.Fragment>
              )) : rows.map((row) => renderRow(row))
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
            pageSizeOptions={pageSizeOptions}
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
