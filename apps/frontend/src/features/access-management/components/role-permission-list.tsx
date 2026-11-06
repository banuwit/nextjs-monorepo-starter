"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type {
  AccessMatrix,
  PermissionPage,
  WorkspaceRole,
} from "../types/access-management";
import {
  hasGrant,
  isGrantChanged,
  listPageActions,
  permissionId,
} from "../utils/access-matrix";

type RolePermissionListProps = {
  role: WorkspaceRole;
  pages: readonly PermissionPage[];
  saved: AccessMatrix;
  matrix: AccessMatrix;
  readOnly: boolean;
  onToggle: (roleId: string, permissionId: string, granted: boolean) => void;
};

/** Pages as a list; each page shows its own actions as a switch with its label. */
export function RolePermissionList({
  role,
  pages,
  saved,
  matrix,
  readOnly,
  onToggle,
}: RolePermissionListProps) {
  return (
    <ul aria-label={`${role.name} page permissions`} className="divide-y">
      {pages.map((page) => {
        const actions = listPageActions(page);
        const granted = actions.filter((action) =>
          hasGrant(matrix, role, permissionId(page.id, action.id)),
        ).length;

        return (
          <li
            key={page.id}
            className="grid gap-3 px-4 py-3 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-6"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">{page.name}</h3>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {granted}/{actions.length}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {page.description}
              </p>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(10.5rem,1fr))] items-center gap-x-4 gap-y-3">
              {actions.map((action) => {
                const id = permissionId(page.id, action.id);
                const switchId = `${role.id}-${id}`;
                const changed = isGrantChanged(saved, matrix, role, id);

                return (
                  <Field
                    key={action.id}
                    orientation="horizontal"
                    className="w-auto"
                  >
                    <Switch
                      id={switchId}
                      checked={hasGrant(matrix, role, id)}
                      disabled={readOnly || role.locked}
                      onCheckedChange={(checked) =>
                        onToggle(role.id, id, checked)
                      }
                      aria-label={`${action.name} for ${role.name}${role.locked ? " (locked)" : ""}${changed ? " (unsaved)" : ""}`}
                      // Granted reads green; a pending change reads amber until saved or discarded.
                      className={cn(
                        "data-checked:bg-emerald-500 dark:data-checked:bg-emerald-500",
                        changed &&
                          "data-checked:bg-amber-400 data-unchecked:ring-2 data-unchecked:ring-amber-400/60 dark:data-checked:bg-amber-400",
                        role.locked && "data-disabled:opacity-60",
                      )}
                    />
                    <FieldLabel htmlFor={switchId} className="font-medium">
                      {action.name}
                    </FieldLabel>
                  </Field>
                );
              })}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
