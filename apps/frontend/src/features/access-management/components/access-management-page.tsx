"use client";

import {
  CircleCheckIcon,
  CircleDotIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  initialAccessMatrix,
  permissionGroups,
} from "@/mocks/access-management.mock";
import type { NewRoleValues } from "../schemas/new-role.schema";
import type { AccessMatrix } from "../types/access-management";
import {
  countChanges,
  countGrants,
  createRoleId,
  isGrantChanged,
  toggleGrant,
} from "../utils/access-matrix";
import { NewRoleDialog } from "./new-role-dialog";
import { PermissionMatrixTable } from "./permission-matrix-table";

// Role chip tones mirror the reference; roles created later fall back to plain.
const roleTones: Record<string, string> = {
  owner: "border-border bg-muted text-foreground",
  admin:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/15 dark:text-violet-300",
  billing:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-200",
  support:
    "border-violet-200 text-violet-700 dark:border-violet-400/30 dark:text-violet-300",
};

const totalPermissions = permissionGroups.reduce(
  (sum, group) => sum + group.rows.length,
  0,
);

export function AccessManagementPage() {
  const [saved, setSaved] = useState<AccessMatrix>(initialAccessMatrix);
  const [draft, setDraft] = useState<AccessMatrix>(initialAccessMatrix);
  const [readOnly, setReadOnly] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState("members");
  const [focusRoleId, setFocusRoleId] = useState("admin");
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const changes = countChanges(saved, draft);
  const dirty = changes > 0;
  const activeGroup = permissionGroups.find(
    (group) => group.id === activeGroupId,
  );
  const focusRole =
    draft.roles.find((role) => role.id === focusRoleId) ??
    draft.roles.find((role) => role.id === "admin");
  const changedGroups = permissionGroups.filter((group) =>
    draft.roles.some((role) =>
      group.rows.some((row) => isGrantChanged(saved, draft, role, row.id)),
    ),
  ).length;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function handleToggle(
    roleId: string,
    permissionId: string,
    granted: boolean,
  ) {
    setDraft((current) => toggleGrant(current, roleId, permissionId, granted));
    setFocusRoleId(roleId);
  }

  function handleCreateRole(values: NewRoleValues) {
    const id = createRoleId(values.name, draft.roles);
    setDraft((current) => {
      const base = current.roles.find((role) => role.id === values.baseRoleId);
      const baseGrants = base?.locked
        ? permissionGroups.flatMap((group) => group.rows.map((row) => row.id))
        : (current.grants[values.baseRoleId] ?? []);
      return {
        roles: [
          ...current.roles,
          { id, name: values.name, description: values.description },
        ],
        grants: { ...current.grants, [id]: baseGrants },
      };
    });
    setFocusRoleId(id);
    setNewRoleOpen(false);
    toast.add({
      title: `Role “${values.name}” created`,
      description: "Save changes to apply it to the workspace.",
      type: "success",
    });
  }

  function handleSave() {
    setSaved(draft);
    setConfirmOpen(false);
    toast.add({
      title: "Permissions saved",
      description: "All scopes are up to date.",
      type: "success",
    });
  }

  function handleDiscard() {
    setDraft(saved);
    if (!saved.roles.some((role) => role.id === focusRoleId))
      setFocusRoleId("admin");
  }

  return (
    <AppBody>
      <PageHeading title="Access Management" currentPage="Access Management" />

      <section
        aria-labelledby="roles-permissions-title"
        className="flex min-w-0 flex-col rounded-xl border bg-muted/50 p-1"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
          <div className="flex min-w-0 flex-col">
            <h2 id="roles-permissions-title" className="text-sm font-semibold">
              Roles &amp; Permissions
            </h2>
            <p className="text-xs text-muted-foreground">
              {draft.roles.length} roles <span aria-hidden="true">·</span>{" "}
              {totalPermissions} permissions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              aria-pressed={!readOnly}
              onClick={() => setReadOnly((value) => !value)}
            >
              {readOnly ? (
                <EyeIcon data-icon="inline-start" />
              ) : (
                <PencilIcon data-icon="inline-start" />
              )}
              {readOnly ? "Viewing" : "Editing"}
            </Button>
            <Button
              size="sm"
              disabled={readOnly}
              onClick={() => setNewRoleOpen(true)}
            >
              <PlusIcon data-icon="inline-start" />
              Create role
            </Button>
          </div>
        </header>

        <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card text-card-foreground">
          {readOnly && (
            <Alert className="rounded-none border-0 border-b">
              <EyeIcon />
              <AlertTitle>View only</AlertTitle>
              <AlertDescription>
                Switch back to Editing to change grants or create roles.
              </AlertDescription>
            </Alert>
          )}

          <Tabs
            value={activeGroupId}
            onValueChange={(value) => setActiveGroupId(String(value))}
            className="min-w-0 gap-0"
          >
            <div className="overflow-x-auto border-b px-2">
              <TabsList variant="line" className="h-11">
                {permissionGroups.map((group) => (
                  <TabsTrigger
                    key={group.id}
                    value={group.id}
                    className="gap-1.5 px-2"
                  >
                    {group.name}
                    <Badge
                      variant="outline"
                      className="h-4.5 min-w-4.5 px-1 tabular-nums text-muted-foreground"
                    >
                      {group.rows.length}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {activeGroup && focusRole && (
              <div className="flex flex-col gap-2 border-b px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  {focusRole.name} grants{" "}
                  {countGrants(draft, focusRole, [activeGroup])} of{" "}
                  {activeGroup.rows.length} <span aria-hidden="true">·</span>{" "}
                  {activeGroup.name} group
                </p>
                <div
                  role="group"
                  aria-label="Role grants in this group"
                  className="flex flex-wrap gap-1"
                >
                  {draft.roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      aria-pressed={role.id === focusRole.id}
                      onClick={() => setFocusRoleId(role.id)}
                      className={cn(
                        "inline-flex h-5 items-center gap-1 rounded-md border border-transparent px-1.5 text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        roleTones[role.id],
                        role.id === focusRole.id && "ring-2 ring-ring/40",
                      )}
                    >
                      {role.name}
                      <span className="tabular-nums">
                        {countGrants(draft, role, [activeGroup])}/
                        {activeGroup.rows.length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {permissionGroups.map((group) => (
              <TabsContent key={group.id} value={group.id} className="min-w-0">
                <PermissionMatrixTable
                  rows={group.rows}
                  saved={saved}
                  matrix={draft}
                  readOnly={readOnly}
                  onToggle={handleToggle}
                />
              </TabsContent>
            ))}
          </Tabs>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2">
            <div
              aria-live="polite"
              className="flex items-center gap-2 text-xs text-muted-foreground"
            >
              {dirty ? (
                <>
                  <Badge className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-200">
                    <CircleDotIcon data-icon="inline-start" />
                    {changes} unsaved
                  </Badge>
                  {changedGroups > 0
                    ? `Pending in ${changedGroups} ${changedGroups === 1 ? "scope" : "scopes"}`
                    : "New role pending"}
                </>
              ) : (
                <>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-300">
                    <CircleCheckIcon data-icon="inline-start" />
                    Saved
                  </Badge>
                  All scopes saved
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={!dirty || readOnly}
                onClick={handleDiscard}
              >
                Discard
              </Button>
              <Button
                size="sm"
                disabled={!dirty || readOnly}
                onClick={() => setConfirmOpen(true)}
              >
                Save changes
              </Button>
            </div>
          </footer>
        </div>
      </section>

      <NewRoleDialog
        open={newRoleOpen}
        onOpenChange={setNewRoleOpen}
        roles={draft.roles}
        onCreate={handleCreateRole}
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save permission changes?</AlertDialogTitle>
            <AlertDialogDescription>
              {changes} {changes === 1 ? "change" : "changes"} will apply
              immediately to every member with the affected roles.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              Save changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </AppBody>
  );
}
