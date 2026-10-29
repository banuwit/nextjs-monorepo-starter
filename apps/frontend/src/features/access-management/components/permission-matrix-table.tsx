"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { LockIcon } from "lucide-react";
import { createContext, use, useMemo } from "react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type {
  AccessMatrix,
  PermissionRow,
  WorkspaceRole,
} from "../types/access-management";
import { hasGrant, isGrantChanged } from "../utils/access-matrix";

type MatrixContextValue = {
  saved: AccessMatrix;
  matrix: AccessMatrix;
  readOnly: boolean;
  onToggle: (roleId: string, permissionId: string, granted: boolean) => void;
};

// Cells read changing state from context so column defs stay stable while toggling.
const MatrixContext = createContext<MatrixContextValue | null>(null);

function useMatrix() {
  const value = use(MatrixContext);
  if (!value)
    throw new Error("useMatrix must be used inside PermissionMatrixTable.");
  return value;
}

function GrantSwitch({
  role,
  permission,
}: {
  role: WorkspaceRole;
  permission: PermissionRow;
}) {
  const { saved, matrix, readOnly, onToggle } = useMatrix();
  const changed = isGrantChanged(saved, matrix, role, permission.id);

  return (
    <div className="flex justify-center">
      <Switch
        checked={hasGrant(matrix, role, permission.id)}
        disabled={readOnly || role.locked}
        onCheckedChange={(checked) => onToggle(role.id, permission.id, checked)}
        aria-label={`${permission.name} for ${role.name}${role.locked ? " (locked)" : ""}${changed ? " (unsaved)" : ""}`}
        // Granted reads green; a pending change reads amber until saved or discarded.
        className={cn(
          "data-checked:bg-emerald-500 dark:data-checked:bg-emerald-500",
          changed &&
            "data-checked:bg-amber-400 data-unchecked:ring-2 data-unchecked:ring-amber-400/60 dark:data-checked:bg-amber-400",
          role.locked && "data-disabled:opacity-60",
        )}
      />
    </div>
  );
}

const lockedColumnClass = "bg-muted/60";

export function PermissionMatrixTable({
  rows,
  ...context
}: MatrixContextValue & { rows: PermissionRow[] }) {
  const { roles } = context.matrix;
  const lockedIds = useMemo(
    () => new Set(roles.filter((role) => role.locked).map((role) => role.id)),
    [roles],
  );

  const columns = useMemo<ColumnDef<DataGridFeatures, PermissionRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <DataGridHeader
            title="Permission"
            className="font-normal text-muted-foreground"
          />
        ),
        cell: ({ row }) => (
          <div className="flex min-w-52 flex-col gap-0.5 whitespace-normal">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.description}
            </span>
          </div>
        ),
      },
      ...roles.map<ColumnDef<DataGridFeatures, PermissionRow>>((role) => ({
        id: role.id,
        header: () => (
          <div className="flex h-8 min-w-24 items-center justify-center gap-1.5 font-normal text-muted-foreground">
            {role.locked && (
              <LockIcon aria-hidden="true" className="size-3.5" />
            )}
            {role.name}
            {role.locked && <span className="sr-only">(locked)</span>}
          </div>
        ),
        cell: ({ row }) => (
          <GrantSwitch role={role} permission={row.original} />
        ),
      })),
    ],
    [roles],
  );

  return (
    <MatrixContext value={context}>
      <DataGridClient
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        pagination="none"
        showVisibilityToggle={false}
        showHeaderVisibilityToggle={false}
        columnLines
        bordered={false}
        defaultColumnPinning={{ start: ["name"], end: [] }}
        tableProps={{ "aria-label": "Role permission matrix" }}
        getHeaderProps={(columnId) => ({
          className: cn(
            "bg-card",
            lockedIds.has(columnId) && lockedColumnClass,
          ),
        })}
        getCellProps={({ columnId }) => ({
          className: cn(lockedIds.has(columnId) && lockedColumnClass),
        })}
      />
    </MatrixContext>
  );
}
