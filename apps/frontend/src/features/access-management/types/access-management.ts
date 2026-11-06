export type WorkspaceRole = {
  id: string;
  name: string;
  description: string;
  /** Locked roles always hold every permission and cannot be edited. */
  locked?: boolean;
};

export type PermissionActionId =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "export"
  | "manage";

/** A table column: something a role can do on a page. */
export type PermissionAction = {
  id: PermissionActionId;
  name: string;
};

/**
 * A table row. `permissions` lists only the actions the page supports, each with
 * a description; a missing action is not applicable. The permission id is
 * `<page id>.<action id>` (see `permissionId`).
 */
export type PermissionPage = {
  id: string;
  name: string;
  description: string;
  permissions: Partial<Record<PermissionActionId, string>>;
};

/** Permission ids granted to each role, keyed by role id. */
export type RoleGrants = Record<string, readonly string[]>;

export type AccessMatrix = {
  roles: WorkspaceRole[];
  grants: RoleGrants;
};
