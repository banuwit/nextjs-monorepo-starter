"use client";

import { useMemo } from "react";
import { useTable, type ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
import {
  DataGrid,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/components/data-grid/data-grid";
import { DataGridTable } from "@/components/data-grid/data-grid-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FileManagerFile } from "../file-manager-model";
import { FileActions } from "./file-actions";
import { fileIcons } from "./file-icons";

export function FileListView({
  files,
  onToggleStar,
  onDelete,
}: {
  files: FileManagerFile[];
  onToggleStar: (id: string) => void;
  onDelete: (file: FileManagerFile) => void;
}) {
  const columns = useMemo<ColumnDef<DataGridFeatures, FileManagerFile>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        meta: { headerClassName: "pl-0", cellClassName: "pl-0" },
        cell: ({ row: { original: file } }) => {
          const Icon = fileIcons[file.kind];
          return (
            <div className="flex min-w-0 items-center gap-3">
              <Icon
                className="size-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span
                className="max-w-40 truncate font-medium sm:max-w-72"
                title={file.name}
              >
                {file.name}
              </span>
              {file.shared && (
                <Badge variant="outline" className="hidden xl:inline-flex">
                  Shared
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "owner",
        header: "Owner",
        meta: {
          headerClassName: "hidden md:table-cell",
          cellClassName: "hidden md:table-cell",
        },
        cell: ({ row: { original: file } }) => (
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>{file.ownerInitials}</AvatarFallback>
            </Avatar>
            <span>{file.owner}</span>
          </div>
        ),
      },
      {
        accessorKey: "modifiedAt",
        header: "Modified",
        meta: {
          headerClassName: "hidden lg:table-cell",
          cellClassName: "hidden text-muted-foreground lg:table-cell",
        },
      },
      {
        accessorKey: "size",
        header: "Size",
        meta: {
          headerClassName: "hidden sm:table-cell",
          cellClassName: "hidden text-muted-foreground sm:table-cell",
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row: { original: file } }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-pressed={file.starred}
              aria-label={`${file.starred ? "Unstar" : "Star"} ${file.name}`}
              onClick={() => onToggleStar(file.id)}
            >
              <Star className={cn(file.starred && "fill-current")} />
            </Button>
            <FileActions
              file={file}
              onToggleStar={() => onToggleStar(file.id)}
              onDelete={() => onDelete(file)}
            />
          </div>
        ),
      },
    ],
    [onToggleStar, onDelete],
  );

  const table = useTable({
    features: dataGridFeatures,
    data: files,
    columns,
    getRowId: (file) => file.id,
    manualPagination: true,
    manualSorting: true,
  });
  return (
    <DataGrid
      table={table}
      recordCount={files.length}
      tableLayout={{ width: "auto", rowBorder: true }}
    >
      <div className="overflow-x-auto">
        <DataGridTable />
      </div>
    </DataGrid>
  );
}
