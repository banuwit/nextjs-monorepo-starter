import type {
  NavigationItem,
  NavigationSection,
} from "@/components/layout/app-navigation";

export function isNavigationItemActive(
  item: NavigationItem,
  pathname: string,
): boolean {
  if (item.items?.length) {
    return item.items.some((child) => isNavigationItemActive(child, pathname));
  }

  const currentPath = pathname === "/dashboard" ? "/dashboard/main" : pathname;
  return (
    item.url.startsWith("/") &&
    (currentPath === item.url || currentPath.startsWith(`${item.url}/`))
  );
}

export function findActiveNavigationSection(
  sections: NavigationSection[],
  pathname: string,
): NavigationSection | undefined {
  return (
    sections.find((section) =>
      section.items.some((item) => isNavigationItemActive(item, pathname)),
    ) ?? sections[0]
  );
}
