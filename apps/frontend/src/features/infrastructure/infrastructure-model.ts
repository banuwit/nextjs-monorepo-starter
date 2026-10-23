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

export function filterInfrastructure(
  groups: InfrastructureGroup[],
  search: string,
  filters: InfrastructureFilters,
): InfrastructureGroup[] {
  const query = search.trim().toLowerCase();
  const hasRowFilters = Boolean(
    filters.platform || filters.server || filters.environment || filters.status,
  );
  return groups.flatMap((group) => {
    if (filters.organization && group.organization !== filters.organization)
      return [];
    if (filters.project && group.name !== filters.project) return [];
    const matchesProject = `${group.name} ${group.organization}`
      .toLowerCase()
      .includes(query);
    const rows = group.rows.filter(
      (row) =>
        (matchesProject || row.domain.toLowerCase().includes(query)) &&
        (!filters.platform || row.platform.name === filters.platform) &&
        (!filters.server || row.server === filters.server) &&
        (!filters.environment || row.environment === filters.environment) &&
        (!filters.status || row.status === filters.status),
    );
    if (rows.length || (!group.rows.length && matchesProject && !hasRowFilters))
      return [{ ...group, rows }];
    return [];
  });
}
