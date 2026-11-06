import type {
  AccessMatrix,
  PermissionPage,
} from "@/features/access-management/types/access-management";

/**
 * Pages in the list. Every page has view, create, edit, and delete; `extraActions`
 * lists the custom ones. Permission ids are `<page id>.<action id>`.
 */
export const permissionPages = [
  {
    id: "members",
    name: "Members",
    description: "Directory of workspace members",
    extraActions: [
      { id: "import", name: "Import" },
      { id: "export", name: "Export" },
      { id: "approve", name: "Approve invites" },
      { id: "transfer", name: "Transfer owner" },
    ],
  },
  {
    id: "roles",
    name: "Roles",
    description: "Custom roles and what they grant",
  },
  {
    id: "billing",
    name: "Billing",
    description: "Invoices, payment, and the plan",
    extraActions: [
      { id: "export", name: "Export invoices" },
      { id: "plan", name: "Change plan" },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    description: "All workspace projects",
    extraActions: [
      { id: "move", name: "Move" },
      { id: "archive", name: "Archive" },
      { id: "export", name: "Export" },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    description: "Workspace configuration",
    extraActions: [{ id: "domains", name: "Manage domains" }],
  },
  {
    id: "audit",
    name: "Audit log",
    description: "Sign-ins and sensitive changes",
    extraActions: [
      { id: "export", name: "Export" },
      { id: "stream", name: "Stream to SIEM" },
    ],
  },
  {
    id: "api-keys",
    name: "API keys",
    description: "Keys scoped to one project",
    extraActions: [{ id: "rotate", name: "Rotate" }],
  },
  {
    id: "sso",
    name: "SSO",
    description: "Identity provider connection",
    extraActions: [
      { id: "scim", name: "Manage SCIM" },
      { id: "enforce", name: "Enforce SSO" },
    ],
  },
] satisfies PermissionPage[];

const standardActionIds = ["view", "create", "edit", "delete"];

const allPermissionIds = permissionPages.flatMap((page: PermissionPage) =>
  [...standardActionIds, ...(page.extraActions ?? []).map(({ id }) => id)].map(
    (actionId) => `${page.id}.${actionId}`,
  ),
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
        !["members.transfer", "settings.delete", "billing.plan"].includes(id),
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
      "billing.plan",
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
