"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  type NavigationItem,
  useAppNavigation,
} from "@/components/layout/app-navigation";
import { isNavigationItemActive } from "@/components/layout/navigation-active";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

function NavigationMenuItem({
  item,
  pathname,
}: {
  item: NavigationItem;
  pathname: string;
}) {
  const active = isNavigationItemActive(item, pathname);

  if (item.items?.length) {
    return (
      <MenubarSub>
        <MenubarSubTrigger
          data-active={active}
          className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
        >
          {item.icon}
          {item.title}
        </MenubarSubTrigger>
        <MenubarSubContent>
          {item.items.map((child) => (
            <NavigationMenuItem
              key={child.title}
              item={child}
              pathname={pathname}
            />
          ))}
        </MenubarSubContent>
      </MenubarSub>
    );
  }

  if (!item.url.startsWith("/")) return null;

  return (
    <MenubarItem
      data-active={active}
      className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
      render={
        <Link href={item.url} aria-current={active ? "page" : undefined} />
      }
    >
      {item.icon}
      {item.title}
    </MenubarItem>
  );
}

export function AppHeaderMenubar() {
  const navigation = useAppNavigation();
  const pathname = usePathname();

  return (
    <nav
      data-slot="app-header-menubar"
      aria-label="Main navigation"
      className="hidden border-b px-2 py-0.5 md:block"
    >
      <Menubar className="h-7 border-0 bg-transparent p-0">
        {navigation.map((section) => (
          <MenubarMenu key={section.title}>
            <MenubarTrigger
              data-active={section.items.some((item) =>
                isNavigationItemActive(item, pathname),
              )}
              className="px-2 py-1 text-xs data-[active=true]:bg-muted"
            >
              {section.title}
            </MenubarTrigger>
            <MenubarContent className="min-w-48">
              {section.items.map((item) => (
                <NavigationMenuItem
                  key={item.title}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    </nav>
  );
}
