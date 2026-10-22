"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 10;

export type CrudColumn<T> = {
  key: string;
  label: string;
  value: (row: T) => string | number | boolean;
  render?: (row: T) => ReactNode;
  width?: number;
};

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
}) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  return (
    <section
      aria-label={`Daftar ${title}`}
      className="min-w-0 overflow-hidden rounded-xl border bg-card"
    >
      <div className="flex items-center gap-2 border-b p-4">
        <h2 className="font-semibold">Semua {title.toLowerCase()}</h2>
        <Badge variant="secondary">{loading ? "…" : rows.length}</Badge>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.label}
              </TableHead>
            ))}
            <TableHead className="w-32">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="py-8 text-center text-muted-foreground"
              >
                Memuat data…
              </TableCell>
            </TableRow>
          ) : pageRows.length ? (
            pageRows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className="max-w-72 truncate"
                    title={String(column.value(row))}
                  >
                    {column.render
                      ? column.render(row)
                      : String(column.value(row))}
                  </TableCell>
                ))}
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="py-8 text-center text-muted-foreground"
              >
                Belum ada data. Tambahkan data pertama Anda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4 text-xs text-muted-foreground">
        <p role="status">
          {rows.length ? currentPage * PAGE_SIZE + 1 : 0}–
          {Math.min((currentPage + 1) * PAGE_SIZE, rows.length)} dari{" "}
          {rows.length} data
        </p>
        <div className="flex items-center gap-2">
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
