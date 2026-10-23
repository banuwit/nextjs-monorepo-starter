import type { InfrastructureGroup } from "../features/infrastructure/types/infrastructure";

export const infrastructureGroups: InfrastructureGroup[] = [
  {
    name: "Admin Console",
    organization: "Weblabs Studio",
    rows: [
      {
        domain: "next-shadcn-admin-dashboard.vercel.app/dashboard",
        platform: {
          name: "Next.js",
        },
        environment: "Expired",
        status: "Unhealthy",
        latency: "86ms",
        uptime: "8d 23h",
        server: "Hetzner Cloud",
        countryCode: "DE",
        plan: "CX33, Falkenstein",
        resources: { cpu: 60, ram: 73, disk: 41 },
      },
    ],
  },
  {
    name: "Analytics",
    organization: "Aiy Cap",
    rows: [
      {
        domain: "next-shadcn-admin-dashboard.vercel.app/analytics",
        platform: {
          name: "React",
        },
        environment: "Production",
        status: "Online",
        latency: "246ms",
        uptime: "9d 23h",
        server: "AWS",
        countryCode: "NL",
        plan: "eu-west-1, Amsterdam",
        resources: { cpu: 49, ram: 42, disk: 44 },
      },
      {
        domain: "next-shadcn-admin-dashboard.vercel.app/reports",
        platform: {
          name: "Remix",
        },
        environment: "Staging",
        status: "Online",
        latency: "110ms",
        uptime: "9d 23h",
        server: "Azure",
        countryCode: "EE",
        plan: "North Europe, Tallinn",
        resources: { cpu: 37, ram: 46, disk: 64 },
      },
    ],
  },
  {
    name: "Kanban",
    organization: "Storeframe",
    rows: [
      {
        domain: "next-shadcn-admin-dashboard.vercel.app/kanban",
        platform: {
          name: "Node.js",
        },
        environment: "Production",
        status: "Online",
        latency: "25ms",
        uptime: "10d 23h",
        server: "Bare Metal / Custom",
        countryCode: "DE",
        plan: "EX101, Falkenstein",
        resources: { cpu: 1, ram: 21, disk: 4 },
      },
    ],
  },
  {
    name: "Inbox",
    organization: "Acme Corp",
    rows: [],
  },
];

// Global demo totals from the reference include projects outside this sample.
export const infrastructureSummary = {
  projects: 6,
  environments: 16,
  servers: 36,
  uptime: "99.93%",
};
