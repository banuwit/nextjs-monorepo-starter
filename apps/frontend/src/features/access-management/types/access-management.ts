export type WorkspaceRole = {
  id: string;
  name: string;
  description: string;
  /** Locked roles always hold every permission and cannot be edited. */
  locked?: boolean;
};

/** One switch on a page. */
export type PermissionAction = {
  /** Unique within its page; the permission id is `<page id>.<action id>`. */
  id: string;
  name: string;
};

/**
 * Every page has the standard actions (view, create, edit, delete). `extraActions`
 * adds custom ones such as import, export, approval, or move. Extra ids must not
 * reuse a standard id.
 */
export type PermissionPage = {
  id: string;
  name: string;
  description: string;
  extraActions?: PermissionAction[];
};

/** Permission ids granted to each role, keyed by role id. */
export type RoleGrants = Record<string, readonly string[]>;

export type AccessMatrix = {
  roles: WorkspaceRole[];
  grants: RoleGrants;
};
