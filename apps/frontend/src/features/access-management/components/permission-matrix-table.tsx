"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { createContext, use, useMemo } from "react";

import { DataGridClient } from "@/components/data-grid/data-grid-client";
import type { DataGridFeatures } from "@/components/data-grid/data-grid-features";
import { DataGridHeader } from "@/components/data-grid/data-grid-header";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type {
  AccessMatrix,
  PermissionAction,
  PermissionPage,
  WorkspaceRole,
} from "../types/access-management";
import { hasGrant, isGrantChanged, permissionId } from "../utils/access-matrix";

type MatrixContextValue = {
  role: WorkspaceRole;
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

function GrantCell({
  page,
  action,
}: {
  page: PermissionPage;
  action: PermissionAction;
}) {
  const { role, saved, matrix, readOnly, onToggle } = useMatrix();
  const description = page.permissions[action.id];

  if (description === undefined) {
    return (
      <div className="flex justify-center text-muted-foreground">
        <span aria-hidden="true">—</span>
        <span className="sr-only">
          {action.name} is not available for {page.name}
        </span>
      </div>
    );
  }

  const id = permissionId(page.id, action.id);
  const changed = isGrantChanged(saved, matrix, role, id);

  return (
    <div className="flex justify-center">
      <Switch
        checked={hasGrant(matrix, role, id)}
        disabled={readOnly || role.locked}
        onCheckedChange={(checked) => onToggle(role.id, id, checked)}
        aria-label={`${action.name} ${page.name} for ${role.name}${role.locked ? " (locked)" : ""}${changed ? " (unsaved)" : ""}`}
        title={description}
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

type PermissionMatrixTableProps = MatrixContextValue & {
  pages: readonly PermissionPage[];
  actions: readonly PermissionAction[];
};

/** Pages as rows and actions as columns, for one role. */
export function PermissionMatrixTable({
  pages,
  actions,
  ...context
}: PermissionMatrixTableProps) {
  const columns = useMemo<ColumnDef<DataGridFeatures, PermissionPage>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => (
          <DataGridHeader
            title="Page"
            className="font-normal text-muted-foreground"
          />
        ),
        cell: ({ row }) => (
          <div className="flex min-w-40 flex-col gap-0.5 whitespace-normal">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.description}
            </span>
          </div>
        ),
      },
      ...actions.map<ColumnDef<DataGridFeatures, PermissionPage>>(
        (action) => ({
          id: action.id,
          header: () => (
            <div className="flex h-8 min-w-20 items-center justify-center font-normal text-muted-foreground">
              {action.name}
            </div>
          ),
          cell: ({ row }) => <GrantCell page={row.original} action={action} />,
        }),
      ),
    ],
    [actions],
  );

  return (
    <MatrixContext value={context}>
      <DataGridClient
        columns={columns}
        data={[...pages]}
        getRowId={(row) => row.id}
        pagination="none"
        showVisibilityToggle={false}
        showHeaderVisibilityToggle={false}
        columnLines
        bordered={false}
        defaultColumnPinning={{ start: ["name"], end: [] }}
        tableProps={{ "aria-label": `${context.role.name} page permissions` }}
        getHeaderProps={() => ({ className: "bg-card" })}
      />
    </MatrixContext>
  );
}
