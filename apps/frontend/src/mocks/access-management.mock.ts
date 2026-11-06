import type {
  AccessMatrix,
  PermissionAction,
  PermissionPage,
} from "@/features/access-management/types/access-management";

/** Table columns. A page only supports the actions listed in its `permissions`. */
export const permissionActions = [
  { id: "view", name: "View" },
  { id: "create", name: "Create" },
  { id: "edit", name: "Edit" },
  { id: "delete", name: "Delete" },
  { id: "export", name: "Export" },
  { id: "manage", name: "Manage" },
] satisfies PermissionAction[];

/** Table rows. Permission ids are `<page id>.<action id>`. */
export const permissionPages = [
  {
    id: "members",
    name: "Members",
    description: "Directory of workspace members",
    permissions: {
      view: "View the directory of 12 active members",
      create: "Send invites that expire in 7 days",
      delete: "Deactivate or remove a member",
      export: "Download seat and role CSV",
      manage: "Transfer Owner after handoff approval",
    },
  },
  {
    id: "roles",
    name: "Roles",
    description: "Custom roles and what they grant",
    permissions: {
      view: "See every role and what it grants",
      create: "Add custom roles to the workspace",
      edit: "Change the scopes a role can use",
      delete: "Remove custom roles with no members",
    },
  },
  {
    id: "billing",
    name: "Billing",
    description: "Invoices, payment, and the plan",
    permissions: {
      view: "View invoices and payment history",
      create: "Add paid seats",
      edit: "Update cards and billing contacts",
      delete: "Release paid seats",
      manage: "Upgrade, downgrade, or cancel the plan",
    },
  },
  {
    id: "projects",
    name: "Projects",
    description: "All workspace projects",
    permissions: {
      view: "Browse all 8 workspace projects",
      create: "Start a project from a template",
      delete: "Permanently delete a project",
      manage: "Archive finished projects from lists",
    },
  },
  {
    id: "settings",
    name: "Settings",
    description: "Workspace configuration",
    permissions: {
      view: "View workspace configuration",
      edit: "Change the name, logo, and locale",
      delete: "Remove the workspace after 30 days",
      manage: "Add and verify custom domains",
    },
  },
  {
    id: "audit",
    name: "Audit log",
    description: "Sign-ins and sensitive changes",
    permissions: {
      view: "Review sign-ins and sensitive changes",
      edit: "Keep events for 90 days to 2 years",
      export: "Download events as CSV or JSON",
      manage: "Forward events to an external SIEM",
    },
  },
  {
    id: "api-keys",
    name: "API keys",
    description: "Keys scoped to one project",
    permissions: {
      view: "See key names and last-used dates",
      create: "Issue keys scoped to one project",
      edit: "Rotate a key with a 24-hour overlap",
      delete: "Disable a key immediately",
    },
  },
  {
    id: "sso",
    name: "SSO",
    description: "Identity provider connection",
    permissions: {
      view: "View the identity provider connection",
      create: "Provision members from the directory (SCIM)",
      edit: "Upload SAML metadata and map attributes",
      manage: "Require SSO for every member sign-in",
    },
  },
] satisfies PermissionPage[];

const allPermissionIds = permissionPages.flatMap((page) =>
  Object.keys(page.permissions).map((actionId) => `${page.id}.${actionId}`),
);

export const initialAccessMatrix = {
  roles: [
    {
      id: "owner",
      name: "Owner",
      description: "Full control of the workspace.",
      locked: true,
    },
    {
      id: "admin",
      name: "Admin",
      description: "Manages members, roles, and security.",
    },
    {
      id: "member",
      name: "Member",
      description: "Works on projects day to day.",
    },
    {
      id: "billing",
      name: "Billing",
      description: "Handles invoices and the plan.",
    },
    {
      id: "guest",
      name: "Guest",
      description: "Read-only access to shared work.",
    },
    {
      id: "support",
      name: "Support",
      description: "Helps members with their accounts.",
    },
  ],
  grants: {
    owner: allPermissionIds,
    admin: allPermissionIds.filter(
      (id) =>
        !["members.manage", "settings.delete", "billing.manage"].includes(id),
    ),
    member: [
      "members.view",
      "members.create",
      "roles.view",
      "projects.view",
      "projects.create",
      "settings.view",
      "api-keys.view",
    ],
    billing: [
      "members.view",
      "billing.view",
      "billing.create",
      "billing.edit",
      "billing.delete",
      "billing.manage",
      "projects.view",
    ],
    guest: ["members.view", "projects.view"],
    support: [
      "members.view",
      "roles.view",
      "audit.view",
      "sso.view",
      "settings.view",
    ],
  },
} satisfies AccessMatrix;
