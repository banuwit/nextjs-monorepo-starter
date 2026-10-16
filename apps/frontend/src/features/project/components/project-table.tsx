"use client";

import { useMemo } from "react";
import {
  type ColumnDef,
  type SortingState,
  type OnChangeFn,
  useTable,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDownIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  type DataGridFeatures,
} from "@/components/data-grid/data-grid";
import { DataGridTable } from "@/components/data-grid/data-grid-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatProjectDate,
  isOverdue,
  projectPriorities,
  type Project,
} from "../project-model";
import { ProjectProgress, ProjectStatus } from "./project-meta";

export function ProjectTable({
  projects,
  today,
  loading,
  onView,
  onEdit,
  onDelete,
  pageIndex,
  pageSize,
  onSort,
  sorting,
}: {
  projects: Project[];
  today: string;
  loading: boolean;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  pageIndex: number;
  pageSize: number;
  onSort: OnChangeFn<SortingState>;
  sorting: SortingState;
}) {
  const columns = useMemo<ColumnDef<DataGridFeatures, Project>[]>(() => {
    const definitions: ColumnDef<DataGridFeatures, Project>[] = [
      {
        accessorKey: "name",
        header: "Project",
        size: 280,
        cell: ({ row }) => (
          <div className="flex flex-col items-start gap-1 py-2">
            <button
              onClick={() => onView(row.original)}
              className="max-w-full truncate rounded-sm text-left font-medium underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
            >
              {row.original.name}
            </button>
            <span className="max-w-full truncate text-xs text-muted-foreground">
              {row.original.client || "Tanpa klien / tim"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 155,
        cell: ({ row }) => <ProjectStatus status={row.original.status} />,
      },
      {
        accessorKey: "owner",
        header: "Penanggung jawab",
        size: 190,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarFallback>
                {row.original.owner
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{row.original.owner}</span>
          </div>
        ),
      },
      {
        accessorKey: "priority",
        header: "Prioritas",
        size: 105,
        cell: ({ row }) => (
          <Badge
            variant={row.original.priority === "high" ? "outline" : "secondary"}
          >
            {projectPriorities[row.original.priority]}
          </Badge>
        ),
      },
      {
        accessorKey: "progress",
        header: "Progres",
        size: 145,
        cell: ({ row }) => <ProjectProgress project={row.original} />,
      },
      {
        accessorKey: "dueDate",
        header: "Tenggat",
        size: 155,
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span>{formatProjectDate(row.original.dueDate)}</span>
            {today && isOverdue(row.original, today) && (
              <span className="text-xs font-medium text-destructive">
                Lewat tenggat
              </span>
            )}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Aksi</span>,
        size: 100,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${row.original.name}`}
              onClick={() => onEdit(row.original)}
            >
              <PencilIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Hapus ${row.original.name}`}
              onClick={() => onDelete(row.original)}
            >
              <Trash2Icon />
            </Button>
          </div>
        ),
      },
    ];
    return definitions.map((column): ColumnDef<DataGridFeatures, Project> => ({
      ...column,
      id:
        column.id ??
        ("accessorKey" in column ? String(column.accessorKey) : "actions"),
      header:
        typeof column.header === "string"
          ? ({ column: tableColumn }) => (
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2"
                onClick={tableColumn.getToggleSortingHandler()}
              >
                {column.header as string}
                {tableColumn.getIsSorted() === "asc" ? (
                  <ArrowUpIcon data-icon="inline-end" />
                ) : tableColumn.getIsSorted() === "desc" ? (
                  <ArrowDownIcon data-icon="inline-end" />
                ) : (
                  <ArrowUpDownIcon data-icon="inline-end" />
                )}
              </Button>
            )
          : column.header,
    }));
  }, [today, onView, onEdit, onDelete]);

  const table = useTable({
    features: dataGridFeatures,
    data: projects,
    columns,
    getRowId: (row) => row.id,
    state: { pagination: { pageIndex, pageSize }, sorting },
    manualSorting: true,
    enableMultiSort: false,
    onSortingChange: onSort,
  });

  return (
    <DataGrid
      table={table}
      recordCount={projects.length}
      isLoading={loading}
      i18n={{
        labels: { empty: "Tidak ada project.", loading: "Memuat project…" },
      }}
      tableLayout={{ headerBackground: true, rowBorder: true, width: "fixed" }}
    >
      <DataGridContainer>
        <div className="overflow-x-auto">
          <DataGridTable />
        </div>
      </DataGridContainer>
    </DataGrid>
  );
}
