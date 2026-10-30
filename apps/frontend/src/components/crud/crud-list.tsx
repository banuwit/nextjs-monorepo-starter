"use client";

import { createContext, use, useMemo, type ReactNode } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { DataGridHeaderSort } from "@/components/data-grid/data-grid-header-sort";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type CrudColumn<T> = {
  key: string;
  label: string;
  value: (row: T) => string | number | boolean;
  render?: (row: T) => ReactNode;
  width?: number;
};

type CrudListActions = {
  label: (row: { id: string }) => string;
  basePath?: string;
  actionsMenu: boolean;
  onView: (row: { id: string }) => void;
  onEdit: (row: { id: string }) => void;
  onDelete: (row: { id: string }) => void;
};

// Aksi baris lewat context agar definisi kolom tetap stabil antar-render.
const CrudListActionsContext = createContext<CrudListActions | null>(null);

function CrudRowActions({ row }: { row: { id: string } }) {
  const actions = use(CrudListActionsContext);
  if (!actions) return null;
  const { label, basePath, actionsMenu, onView, onEdit, onDelete } = actions;
  if (actionsMenu) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Aksi ${label(row)}`}
            />
          }
        >
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            {basePath ? (
              <>
                <DropdownMenuItem
                  render={<Link href={`${basePath}/${row.id}`} />}
                >
                  <EyeIcon />
                  Detail
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link href={`${basePath}/${row.id}/edit`} />}
                >
                  <PencilIcon />
                  Edit
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => onView(row)}>
                  <EyeIcon />
                  Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(row)}>
                  <PencilIcon />
                  Edit
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(row)}>
            <Trash2Icon />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return (
    <div className="flex gap-1">
      {basePath ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href={`${basePath}/${row.id}`} />}
            aria-label={`Detail ${label(row)}`}
          >
            <EyeIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href={`${basePath}/${row.id}/edit`} />}
            aria-label={`Edit ${label(row)}`}
          >
            <PencilIcon />
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(row)}
            aria-label={`Detail ${label(row)}`}
          >
            <EyeIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row)}
            aria-label={`Edit ${label(row)}`}
          >
            <PencilIcon />
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(row)}
        aria-label={`Hapus ${label(row)}`}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
}

export function CrudList<T extends { id: string }>({
  title,
  rows,
  columns,
  loading,
  label,
  onView,
  onEdit,
  onDelete,
  basePath,
  pinActions = false,
  actionsMenu = false,
}: {
  title: string;
  rows: T[];
  columns: CrudColumn<T>[];
  loading: boolean;
  label: (row: T) => string;
  onView: (row: T) => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  basePath?: string;
  /** Pin kolom Aksi di kanan, berguna saat daftar menyempit oleh panel inline. */
  pinActions?: boolean;
  /** Aksi baris dalam dropdown ikon ellipsis, bukan deretan tombol. */
  actionsMenu?: boolean;
}) {
  const gridColumns = useMemo<ColumnDef<DataGridFeatures, T>[]>(
    () => [
      {
        id: "no",
        header: () => <DataGridHeader title="No" />,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.store.state.pagination;
          const position = table
            .getRowModel()
            .rows.findIndex((item) => item.id === row.id);
          return (
            <span className="tabular-nums">
              {pageIndex * pageSize + position + 1}
            </span>
          );
        },
      },
      ...columns.map((config): ColumnDef<DataGridFeatures, T> => ({
        id: config.key,
        accessorFn: (row) => config.value(row),
        header: ({ column }) => (
          <DataGridHeaderSort column={column} title={config.label} />
        ),
        cell: ({ row }) => (
          <div
            className="max-w-72 truncate"
            style={config.width ? { minWidth: config.width } : undefined}
            title={String(config.value(row.original))}
          >
            {config.render
              ? config.render(row.original)
              : String(config.value(row.original))}
          </div>
        ),
      })),
      {
        id: "actions",
        header: () => <DataGridHeader title="Aksi" />,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => <CrudRowActions row={row.original} />,
      },
    ],
    [columns],
  );
  const searchColumn = columns[0];
  const actions = {
    basePath,
    actionsMenu,
    label,
    onView,
    onEdit,
    onDelete,
  } as CrudListActions;

  return (
    <section aria-label={`Daftar ${title}`} className="min-w-0">
      <Card>
        <CardContent className="min-w-0">
          <CrudListActionsContext value={actions}>
            <DataGridClient
              columns={gridColumns}
              data={rows}
              getRowId={(row) => row.id}
              toolbar={
                searchColumn
                  ? {
                      searches: [
                        {
                          key: searchColumn.key,
                          placeholder: `Cari ${searchColumn.label.toLowerCase()}...`,
                        },
                      ],
                    }
                  : undefined
              }
              loading={loading}
              pagination="simple"
              showVisibilityToggle={false}
              showHeaderVisibilityToggle={false}
              defaultColumnPinning={{
                start: [],
                end: pinActions ? ["actions"] : [],
              }}
              emptyTitle={`Belum ada ${title.toLowerCase()}`}
              emptyDescription="Tambahkan data pertama Anda."
              emptyFilteredTitle={`${title} tidak ditemukan`}
              emptyFilteredDescription="Coba kata kunci lain atau hapus pencarian."
            />
          </CrudListActionsContext>
        </CardContent>
      </Card>
    </section>
  );
}
