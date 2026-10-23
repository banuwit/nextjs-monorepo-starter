import type {
  InfrastructureGroup,
  InfrastructureFilters,
} from "../types/infrastructure";

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
