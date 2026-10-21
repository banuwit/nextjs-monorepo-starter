"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type {
  NavigationItem,
  NavigationSection,
} from "@/components/app-navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "lucide-react";

function isActiveItem(item: NavigationItem, pathname: string): boolean {
  if (item.items?.length) {
    return item.items.some((child) => isActiveItem(child, pathname));
  }

  return (
    item.url.startsWith("/") &&
    (pathname === item.url || pathname.startsWith(`${item.url}/`))
  );
}

export function NavMain({ items }: { items: NavigationSection[] }) {
  const { state, isMobile } = useSidebar();
  const pathname = usePathname();
  const activePath = pathname === "/dashboard" ? "/dashboard/main" : pathname;

  return items.map((section) => (
    <SidebarGroup key={section.title}>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
        {section.title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {section.items.map((item) =>
          item.items?.length ? (
            state === "collapsed" && !isMobile ? (
              <SidebarMenuItem key={item.title}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <SidebarMenuButton
                        aria-label={item.title}
                        isActive={isActiveItem(item, activePath)}
                        tooltip={item.title}
                      />
                    }
                  >
                    {item.icon}
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="right"
                    align="start"
                    className="w-48"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                      {item.items.map((child) => (
                        <DropdownMenuItem
                          key={child.title}
                          className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                          data-active={isActiveItem(child, activePath)}
                          render={
                            <Link
                              href={child.url}
                              aria-current={
                                isActiveItem(child, activePath)
                                  ? "page"
                                  : undefined
                              }
                            />
                          }
                        >
                          {child.title}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ) : (
              <Collapsible
                key={`${item.title}:${activePath}`}
                defaultOpen={isActiveItem(item, activePath)}
                className="group/collapsible"
                render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      isActive={isActiveItem(item, activePath)}
                    />
                  }
                >
                  {item.icon}
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((child) => (
                      <SidebarMenuSubItem key={child.title}>
                        <SidebarMenuSubButton
                          className="w-[calc(100%+1.5rem)]"
                          isActive={isActiveItem(child, activePath)}
                          render={
                            <Link
                              href={child.url}
                              aria-current={
                                isActiveItem(child, activePath)
                                  ? "page"
                                  : undefined
                              }
                            />
                          }
                        >
                          <span>{child.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            )
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActiveItem(item, activePath)}
                tooltip={item.title}
                render={
                  <Link
                    href={item.url}
                    aria-label={item.title}
                    aria-current={
                      isActiveItem(item, activePath) ? "page" : undefined
                    }
                  />
                }
              >
                {item.icon}
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  ));
}
