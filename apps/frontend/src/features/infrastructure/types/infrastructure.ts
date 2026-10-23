export interface InfrastructureEnvironment {
  domain: string;
  platform: {
    name: string;
  };
  environment: "Expired" | "Production" | "Staging";
  status: "Online" | "Unhealthy";
  latency: string;
  uptime: string;
  server: string;
  countryCode: string;
  plan: string;
  resources: {
    cpu: number;
    ram: number;
    disk: number;
  };
}

export interface InfrastructureGroup {
  name: string;
  organization: string;
  rows: InfrastructureEnvironment[];
}

export type InfrastructureFilters = Partial<
  Record<
    | "organization"
    | "platform"
    | "server"
    | "project"
    | "environment"
    | "status",
    string
  >
>;
