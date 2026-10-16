"use client";
import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  useTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns3Icon,
  EyeIcon,
  PencilIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/components/data-grid/data-grid";
import { DataGridTable } from "@/components/data-grid/data-grid-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

export type CrudColumn<T> = {
  key: string;
  label: string;
  value: (row: T) => string | number | boolean;
  render?: (row: T) => ReactNode;
  width?: number;
};
export type CrudFilter<T> = {
  label: string;
  value: (row: T) => string;
  options: { value: string; label: string }[];
};

export function CrudList<T extends { id: string }>({
  title,
  rows,
  columns,
  filters = [],
  loading,
  label,
  onView,
  onEdit,
  onDelete,
  basePath,
}: {
  title: string;
  rows: T[];
  columns: CrudColumn<T>[];
  filters?: CrudFilter<T>[];
  loading: boolean;
  label: (row: T) => string;
  onView: (row: T) => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  basePath?: string;
}) {
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const filtered = useMemo(() => {
    const result = rows.filter(
      (row) =>
        columns.some((column) =>
          String(column.value(row))
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase()),
        ) &&
        filters.every(
          (filter) =>
            !filterValues[filter.label] ||
            filter.value(row) === filterValues[filter.label],
        ),
    );
    const sort = sorting[0];
    const column = columns.find((column) => column.key === sort?.id);
    return sort && column
      ? result.sort(
          (a, b) =>
            String(column.value(a)).localeCompare(
              String(column.value(b)),
              "id",
              { numeric: true },
            ) * (sort.desc ? -1 : 1),
        )
      : result;
  }, [rows, columns, query, filters, filterValues, sorting]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const definitions: ColumnDef<DataGridFeatures, T>[] = columns.map(
    (column) => ({
      id: column.key,
      accessorFn: column.value,
      size: column.width ?? 180,
      header: ({ column: tableColumn }) => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={tableColumn.getToggleSortingHandler()}
        >
          {column.label}
          {tableColumn.getIsSorted() === "asc" ? (
            <ArrowUpIcon data-icon="inline-end" />
          ) : tableColumn.getIsSorted() === "desc" ? (
            <ArrowDownIcon data-icon="inline-end" />
          ) : (
            <ArrowUpDownIcon data-icon="inline-end" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div
          className="truncate py-1"
          title={String(column.value(row.original))}
        >
          {column.render
            ? column.render(row.original)
            : String(column.value(row.original))}
        </div>
      ),
    }),
  );
  definitions.push({
    id: "actions",
    header: "Aksi",
    enableSorting: false,
    enableHiding: false,
    size: 130,
    cell: ({ row }) => (
      <div className="flex gap-1">
        {basePath ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              nativeButton={false}
              render={<Link href={`${basePath}/${row.original.id}`} />}
              aria-label={`Detail ${label(row.original)}`}
            >
              <EyeIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              nativeButton={false}
              render={<Link href={`${basePath}/${row.original.id}/edit`} />}
              aria-label={`Edit ${label(row.original)}`}
            >
              <PencilIcon />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(row.original)}
              aria-label={`Detail ${label(row.original)}`}
            >
              <EyeIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(row.original)}
              aria-label={`Edit ${label(row.original)}`}
            >
              <PencilIcon />
            </Button>
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original)}
          aria-label={`Hapus ${label(row.original)}`}
        >
          <Trash2Icon />
        </Button>
      </div>
    ),
  });
  const table = useTable({
    features: dataGridFeatures,
    data: filtered,
    columns: definitions,
    getRowId: (row) => row.id,
    state: { pagination: { pageIndex: currentPage, pageSize }, sorting },
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: (next) => {
      setSorting(next);
      setPage(0);
    },
  });
  const hasFilters = query || Object.values(filterValues).some(Boolean);
  return (
    <section
      aria-label={`Daftar ${title}`}
      className="min-w-0 overflow-hidden rounded-xl border bg-card"
    >
      <div className="flex items-center justify-between gap-3 border-b p-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Semua {title.toLowerCase()}</h2>
          <Badge variant="secondary">{loading ? "…" : rows.length}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <Columns3Icon data-icon="inline-start" />
            Kolom
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(checked) =>
                      column.toggleVisibility(checked)
                    }
                  >
                    {columns.find((item) => item.key === column.id)?.label}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-wrap gap-3 p-4">
        <InputGroup className="w-full sm:max-w-xs">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            aria-label={`Cari ${title.toLowerCase()}`}
            placeholder={`Cari ${title.toLowerCase()}…`}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
          />
        </InputGroup>
        {filters.map((filter) => (
          <NativeSelect
            key={filter.label}
            aria-label={`Filter ${filter.label}`}
            value={filterValues[filter.label] ?? ""}
            onChange={(event) => {
              setFilterValues({
                ...filterValues,
                [filter.label]: event.target.value,
              });
              setPage(0);
            }}
          >
            <NativeSelectOption value="">
              Semua {filter.label.toLowerCase()}
            </NativeSelectOption>
            {filter.options.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        ))}
        {hasFilters && (
          <Button
            variant="ghost"
            onClick={() => {
              setQuery("");
              setFilterValues({});
              setPage(0);
            }}
          >
            Reset filter
          </Button>
        )}
      </div>
      <DataGrid
        table={table}
        recordCount={filtered.length}
        isLoading={loading}
        i18n={{
          labels: {
            empty: hasFilters
              ? "Tidak ada hasil. Coba kata kunci lain atau reset filter."
              : "Belum ada data. Tambahkan data pertama Anda.",
            loading: "Memuat data…",
          },
        }}
        tableLayout={{
          headerBackground: true,
          rowBorder: true,
          width: "fixed",
        }}
      >
        <DataGridContainer>
          <div className="overflow-x-auto">
            <DataGridTable />
          </div>
        </DataGridContainer>
      </DataGrid>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-xs text-muted-foreground">
        <p role="status">
          {filtered.length ? currentPage * pageSize + 1 : 0}–
          {Math.min((currentPage + 1) * pageSize, filtered.length)} dari{" "}
          {filtered.length} data
        </p>
        <div className="flex items-center gap-2">
          <NativeSelect
            size="sm"
            aria-label="Baris per halaman"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(0);
            }}
          >
            {[5, 10, 20].map((size) => (
              <NativeSelectOption key={size} value={size}>
                {size} / halaman
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <span>
            {currentPage + 1} / {pageCount}
          </span>
          <Button
            size="icon"
            variant="outline"
            aria-label="Halaman sebelumnya"
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="Halaman berikutnya"
            disabled={currentPage + 1 >= pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}
