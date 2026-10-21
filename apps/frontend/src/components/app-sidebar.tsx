"use client";

import * as React from "react";
import Link from "next/link";

import { useAppNavigation } from "@/components/app-navigation";
import { usePreferences } from "@/providers/preferences-provider";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GalleryVerticalEndIcon } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigation = useAppNavigation();
  const { values } = usePreferences();
  return (
    <Sidebar variant={values.sidebarStyle} collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Workspace"
              render={<Link href="/dashboard" aria-label="Workspace" />}
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEndIcon className="size-4" />
              </span>
              <span className="truncate font-medium group-data-[collapsible=icon]:hidden">
                Workspace
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:overflow-y-auto">
        <NavMain items={navigation} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
