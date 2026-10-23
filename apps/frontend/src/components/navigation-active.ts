import type { NavigationItem } from "@/components/app-navigation";

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
