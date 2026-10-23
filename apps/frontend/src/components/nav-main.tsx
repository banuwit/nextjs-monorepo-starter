"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavigationSection } from "@/components/app-navigation";
import { isNavigationItemActive } from "@/components/navigation-active";

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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

export function NavMain({ items }: { items: NavigationSection[] }) {
  const { state, isMobile } = useSidebar();
  const pathname = usePathname();
  const activePath = pathname;

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
                        isActive={isNavigationItemActive(item, activePath)}
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
                      {item.items.map((child) =>
                        child.items?.length ? (
                          <DropdownMenuSub key={child.title}>
                            <DropdownMenuSubTrigger>
                              {child.title}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {child.items.map((grandchild) => (
                                <DropdownMenuItem
                                  key={grandchild.title}
                                  className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                                  data-active={isNavigationItemActive(
                                    grandchild,
                                    activePath,
                                  )}
                                  render={
                                    <Link
                                      href={grandchild.url}
                                      aria-current={
                                        isNavigationItemActive(
                                          grandchild,
                                          activePath,
                                        )
                                          ? "page"
                                          : undefined
                                      }
                                    />
                                  }
                                >
                                  {grandchild.title}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        ) : (
                          <DropdownMenuItem
                            key={child.title}
                            className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                            data-active={isNavigationItemActive(
                              child,
                              activePath,
                            )}
                            render={
                              <Link
                                href={child.url}
                                aria-current={
                                  isNavigationItemActive(child, activePath)
                                    ? "page"
                                    : undefined
                                }
                              />
                            }
                          >
                            {child.title}
                          </DropdownMenuItem>
                        ),
                      )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            ) : (
              <Collapsible
                key={`${item.title}:${activePath}`}
                defaultOpen={isNavigationItemActive(item, activePath)}
                className="group/collapsible"
                render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      isActive={isNavigationItemActive(item, activePath)}
                    />
                  }
                >
                  {item.icon}
                  <span className="min-w-0 flex-1 truncate">{item.title}</span>
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((child) =>
                      child.items?.length ? (
                        <Collapsible
                          key={child.title}
                          defaultOpen={isNavigationItemActive(
                            child,
                            activePath,
                          )}
                          className="group/sub-collapsible"
                          render={<SidebarMenuSubItem />}
                        >
                          <CollapsibleTrigger
                            render={
                              <SidebarMenuSubButton
                                className="w-[calc(100%+1.5rem)] text-left"
                                isActive={isNavigationItemActive(
                                  child,
                                  activePath,
                                )}
                                render={<button type="button" />}
                              />
                            }
                          >
                            <span className="min-w-0 flex-1 truncate">
                              {child.title}
                            </span>
                            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/sub-collapsible:rotate-90" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className="relative left-[0.875rem] mx-0 mt-1 w-full translate-x-0 border-l pl-2.5 pr-0 py-0">
                              {child.items.map((grandchild) => (
                                <SidebarMenuSubItem key={grandchild.title}>
                                  <SidebarMenuSubButton
                                    className="w-[calc(100%+0.5rem)]"
                                    isActive={isNavigationItemActive(
                                      grandchild,
                                      activePath,
                                    )}
                                    render={
                                      <Link
                                        href={grandchild.url}
                                        aria-current={
                                          isNavigationItemActive(
                                            grandchild,
                                            activePath,
                                          )
                                            ? "page"
                                            : undefined
                                        }
                                      />
                                    }
                                  >
                                    <span>{grandchild.title}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuSubItem key={child.title}>
                          <SidebarMenuSubButton
                            className="w-[calc(100%+1.5rem)]"
                            isActive={isNavigationItemActive(child, activePath)}
                            render={
                              <Link
                                href={child.url}
                                aria-current={
                                  isNavigationItemActive(child, activePath)
                                    ? "page"
                                    : undefined
                                }
                              />
                            }
                          >
                            <span>{child.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ),
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            )
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isNavigationItemActive(item, activePath)}
                tooltip={item.title}
                render={
                  <Link
                    href={item.url}
                    aria-label={item.title}
                    aria-current={
                      isNavigationItemActive(item, activePath)
                        ? "page"
                        : undefined
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
