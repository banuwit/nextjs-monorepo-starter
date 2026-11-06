import type {
  AccessMatrix,
  PermissionAction,
  PermissionPage,
  WorkspaceRole,
} from "../types/access-management";

/** Required on every page, always shown first and in this order. */
export const standardActions: readonly PermissionAction[] = [
  { id: "view", name: "View" },
  { id: "create", name: "Create" },
  { id: "edit", name: "Edit" },
  { id: "delete", name: "Delete" },
];

/** Standard actions followed by the page's custom ones. */
export function listPageActions(page: PermissionPage) {
  return [...standardActions, ...(page.extraActions ?? [])];
}

export function permissionId(pageId: string, actionId: string) {
  return `${pageId}.${actionId}`;
}

export function listPermissionIds(pages: readonly PermissionPage[]) {
  return pages.flatMap((page) =>
    listPageActions(page).map((action) => permissionId(page.id, action.id)),
  );
}

export function hasGrant(
  matrix: AccessMatrix,
  role: WorkspaceRole,
  permissionId: string,
) {
  return (
    role.locked || (matrix.grants[role.id]?.includes(permissionId) ?? false)
  );
}

export function toggleGrant(
  matrix: AccessMatrix,
  roleId: string,
  permissionId: string,
  granted: boolean,
): AccessMatrix {
  const current = matrix.grants[roleId] ?? [];
  const next = granted
    ? [...new Set([...current, permissionId])]
    : current.filter((id) => id !== permissionId);
  return { ...matrix, grants: { ...matrix.grants, [roleId]: next } };
}

export function countGrants(
  matrix: AccessMatrix,
  role: WorkspaceRole,
  pages: readonly PermissionPage[],
) {
  return listPermissionIds(pages).filter((id) => hasGrant(matrix, role, id))
    .length;
}

/** Number of pending edits: new roles count once, plus each switched cell. */
export function countChanges(saved: AccessMatrix, draft: AccessMatrix) {
  return draft.roles.reduce((total, role) => {
    const savedRole = saved.roles.some((item) => item.id === role.id);
    if (!savedRole) return total + 1;
    const before = saved.grants[role.id] ?? [];
    const after = draft.grants[role.id] ?? [];
    const added = after.filter((id) => !before.includes(id)).length;
    const removed = before.filter((id) => !after.includes(id)).length;
    return total + added + removed;
  }, 0);
}

export function createRoleId(name: string, roles: readonly WorkspaceRole[]) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "role";
  let id = base;
  for (let suffix = 2; roles.some((role) => role.id === id); suffix += 1) {
    id = `${base}-${suffix}`;
  }
  return id;
}

/** True when a cell differs from the last saved matrix, so it can be highlighted as pending. */
export function isGrantChanged(
  saved: AccessMatrix,
  draft: AccessMatrix,
  role: WorkspaceRole,
  permissionId: string,
) {
  const savedRole = saved.roles.find((item) => item.id === role.id);
  const before = savedRole ? hasGrant(saved, savedRole, permissionId) : false;
  return before !== hasGrant(draft, role, permissionId);
}
