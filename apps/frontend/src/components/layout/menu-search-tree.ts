import type { NavigationItem } from "@/components/layout/app-navigation";

export function filterMenuTree(
  items: NavigationItem[],
  search: string,
  ancestorMatches = false,
): NavigationItem[] {
  const query = search.trim().toLowerCase();

  return items.flatMap((item) => {
    const matches = ancestorMatches || item.title.toLowerCase().includes(query);

    if (item.items?.length) {
      const children = filterMenuTree(item.items, query, matches);
      return children.length ? [{ ...item, items: children }] : [];
    }

    return item.url.startsWith("/") && matches ? [item] : [];
  });
}
