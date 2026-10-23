"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";

import {
  type NavigationItem,
  useAppNavigation,
} from "@/components/app-navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function findNavigationTrail(
  items: NavigationItem[],
  pathname: string,
  ancestors: NavigationItem[] = [],
): NavigationItem[] | undefined {
  for (const item of items) {
    const trail = [...ancestors, item];

    if (item.items?.length) {
      const match = findNavigationTrail(item.items, pathname, trail);
      if (match) return match;
      continue;
    }

    if (pathname === item.url || pathname.startsWith(`${item.url}/`)) {
      return trail;
    }
  }
}

export function NavigationBreadcrumb({ currentPage }: { currentPage: string }) {
  const pathname = usePathname();
  const navigation = useAppNavigation();
  const currentPath = pathname === "/dashboard" ? "/dashboard/main" : pathname;
  const trail = navigation
    .map((section) => findNavigationTrail(section.items, currentPath))
    .find((match) => match);

  if (!trail?.length) return null;

  const lastItem = trail.at(-1)!;
  const isNavigationPage = currentPath === lastItem.url;
  const parents = isNavigationPage ? trail.slice(0, -1) : trail;
  const page = isNavigationPage ? lastItem.title : currentPage;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs">
        {parents.map((item) => (
          <Fragment key={`${item.title}:${item.url}`}>
            <BreadcrumbItem className="hidden md:block">
              {item.url.startsWith("/") ? (
                <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
              ) : (
                <span>{item.title}</span>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{page}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
