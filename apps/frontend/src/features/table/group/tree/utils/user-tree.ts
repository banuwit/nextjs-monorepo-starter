import type { User } from "@/mocks/user.mock";
import type { UserTreeNode, TreeFilters } from "../types/user-tree";

export const emptyTreeFilters: TreeFilters = {
  search: "",
  gender: [],
  role: [],
  status: [],
};

/** Missing managers become roots; visited IDs prevent malformed cycles from losing rows or looping. */
export function buildUserTree(users: User[]): UserTreeNode[] {
  const ids = new Set(users.map((user) => user.id));
  const reports = new Map<string, User[]>();
  for (const user of users) {
    if (user.managerId) {
      const group = reports.get(user.managerId) ?? [];
      group.push(user);
      reports.set(user.managerId, group);
    }
  }
  const visited = new Set<string>();
  const visit = (
    user: User,
    depth: number,
    parentId?: string,
  ): UserTreeNode => {
    visited.add(user.id);
    const children: UserTreeNode[] = [];
    for (const report of reports.get(user.id) ?? []) {
      if (!visited.has(report.id))
        children.push(visit(report, depth + 1, user.id));
    }
    return {
      user,
      depth,
      parentId,
      children,
      directReports: children.length,
      totalReports: children.reduce(
        (total, child) => total + 1 + child.totalReports,
        0,
      ),
      matchesFilter: true,
    };
  };
  const roots: UserTreeNode[] = [];
  for (const user of users) {
    if ((!user.managerId || !ids.has(user.managerId)) && !visited.has(user.id))
      roots.push(visit(user, 0));
  }
  for (const user of users) {
    if (!visited.has(user.id)) roots.push(visit(user, 0));
  }
  return roots;
}

export function filterUserTree(
  nodes: UserTreeNode[],
  filters: TreeFilters,
): UserTreeNode[] {
  const search = filters.search.trim().toLowerCase();
  return nodes.flatMap((node) => {
    const user = node.user;
    const matchesFilter =
      (!filters.gender.length || filters.gender.includes(user.gender)) &&
      (!filters.role.length || filters.role.includes(user.role)) &&
      (!filters.status.length || filters.status.includes(user.status)) &&
      [user.id, user.name, user.email].some((value) =>
        value.toLowerCase().includes(search),
      );
    const children = filterUserTree(node.children, filters);
    return matchesFilter || children.length
      ? [{ ...node, children, matchesFilter }]
      : [];
  });
}

export function getExpandedTreeIds(
  nodes: UserTreeNode[],
  depth: number,
): Set<string> {
  const result = new Set<string>();
  const visit = (node: UserTreeNode) => {
    if (node.children.length && node.depth < depth) result.add(node.user.id);
    node.children.forEach(visit);
  };
  nodes.forEach(visit);
  return result;
}

export function flattenUserTree(
  nodes: UserTreeNode[],
  expanded: Set<string>,
): UserTreeNode[] {
  return nodes.flatMap((node) => [
    node,
    ...(expanded.has(node.user.id)
      ? flattenUserTree(node.children, expanded)
      : []),
  ]);
}
