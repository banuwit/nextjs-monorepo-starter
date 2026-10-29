import type {
  AccessMatrix,
  PermissionGroup,
} from "@/features/access-management/types/access-management";

export const permissionGroups = [
  {
    id: "members",
    name: "Members",
    rows: [
      {
        id: "members.read",
        name: "Read members",
        description: "View the directory of 12 active members",
      },
      {
        id: "members.invite",
        name: "Invite members",
        description: "Send invites that expire in 7 days",
      },
      {
        id: "members.remove",
        name: "Remove members",
        description: "Deactivate or remove a member",
      },
      {
        id: "members.export",
        name: "Export members",
        description: "Download seat and role CSV",
      },
      {
        id: "members.transfer",
        name: "Transfer owner",
        description: "Move Owner after handoff approval",
      },
    ],
  },
  {
    id: "roles",
    name: "Roles",
    rows: [
      {
        id: "roles.read",
        name: "Read roles",
        description: "See every role and what it grants",
      },
      {
        id: "roles.create",
        name: "Create roles",
        description: "Add custom roles to the workspace",
      },
      {
        id: "roles.edit",
        name: "Edit role grants",
        description: "Change the scopes a role can use",
      },
      {
        id: "roles.delete",
        name: "Delete roles",
        description: "Remove custom roles with no members",
      },
    ],
  },
  {
    id: "billing",
    name: "Billing",
    rows: [
      {
        id: "billing.read",
        name: "Read invoices",
        description: "View invoices and payment history",
      },
      {
        id: "billing.payment",
        name: "Manage payment",
        description: "Update cards and billing contacts",
      },
      {
        id: "billing.plan",
        name: "Change plan",
        description: "Upgrade, downgrade, or cancel the plan",
      },
      {
        id: "billing.seats",
        name: "Manage seats",
        description: "Add or release paid seats",
      },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    rows: [
      {
        id: "projects.read",
        name: "Read projects",
        description: "Browse all 8 workspace projects",
      },
      {
        id: "projects.create",
        name: "Create projects",
        description: "Start a project from a template",
      },
      {
        id: "projects.archive",
        name: "Archive projects",
        description: "Hide finished projects from lists",
      },
      {
        id: "projects.delete",
        name: "Delete projects",
        description: "Permanently delete a project",
      },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    rows: [
      {
        id: "settings.read",
        name: "Read settings",
        description: "View workspace configuration",
      },
      {
        id: "settings.profile",
        name: "Edit profile",
        description: "Change the name, logo, and locale",
      },
      {
        id: "settings.domains",
        name: "Manage domains",
        description: "Add and verify custom domains",
      },
      {
        id: "settings.delete",
        name: "Delete workspace",
        description: "Remove the workspace after 30 days",
      },
    ],
  },
  {
    id: "audit",
    name: "Audit",
    rows: [
      {
        id: "audit.read",
        name: "Read audit log",
        description: "Review sign-ins and sensitive changes",
      },
      {
        id: "audit.export",
        name: "Export audit log",
        description: "Download events as CSV or JSON",
      },
      {
        id: "audit.retention",
        name: "Set retention",
        description: "Keep events for 90 days to 2 years",
      },
      {
        id: "audit.stream",
        name: "Stream to SIEM",
        description: "Forward events to an external SIEM",
      },
    ],
  },
  {
    id: "api-keys",
    name: "API keys",
    rows: [
      {
        id: "api.read",
        name: "Read keys",
        description: "See key names and last-used dates",
      },
      {
        id: "api.create",
        name: "Create keys",
        description: "Issue keys scoped to one project",
      },
      {
        id: "api.rotate",
        name: "Rotate keys",
        description: "Replace a key with a 24-hour overlap",
      },
      {
        id: "api.revoke",
        name: "Revoke keys",
        description: "Disable a key immediately",
      },
    ],
  },
  {
    id: "sso",
    name: "SSO",
    rows: [
      {
        id: "sso.read",
        name: "Read SSO setup",
        description: "View the identity provider connection",
      },
      {
        id: "sso.configure",
        name: "Configure SAML",
        description: "Upload metadata and map attributes",
      },
      {
        id: "sso.enforce",
        name: "Enforce SSO",
        description: "Require SSO for every member sign-in",
      },
      {
        id: "sso.scim",
        name: "Manage SCIM",
        description: "Provision members from the directory",
      },
    ],
  },
] satisfies PermissionGroup[];

const allPermissionIds = permissionGroups.flatMap((group) =>
  group.rows.map((row) => row.id),
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
      "members.read",
      "members.invite",
      "roles.read",
      "projects.read",
      "projects.create",
      "settings.read",
      "api.read",
    ],
    billing: [
      "members.read",
      "billing.read",
      "billing.payment",
      "billing.plan",
      "billing.seats",
      "projects.read",
    ],
    guest: ["members.read", "projects.read"],
    support: [
      "members.read",
      "roles.read",
      "audit.read",
      "sso.read",
      "settings.read",
    ],
  },
} satisfies AccessMatrix;
