export type WorkspaceRole = {
  id: string;
  name: string;
  description: string;
  /** Locked roles always hold every permission and cannot be edited. */
  locked?: boolean;
};

export type PermissionRow = {
  id: string;
  name: string;
  description: string;
};

export type PermissionGroup = {
  id: string;
  name: string;
  rows: PermissionRow[];
};

/** Permission ids granted to each role, keyed by role id. */
export type RoleGrants = Record<string, readonly string[]>;

export type AccessMatrix = {
  roles: WorkspaceRole[];
  grants: RoleGrants;
};
