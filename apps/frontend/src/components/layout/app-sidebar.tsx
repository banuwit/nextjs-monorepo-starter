"use client";

import * as React from "react";

import { useAppNavigation } from "@/components/layout/app-navigation";
import { usePreferences } from "@/providers/preferences-provider";
import { NavMain } from "@/components/layout/nav-main";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigation = useAppNavigation();
  const { values } = usePreferences();

  return (
    <Sidebar
      variant={
        values.sidebarStyle === "header" || values.sidebarStyle === "multi"
          ? "sidebar"
          : values.sidebarStyle
      }
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent className="group-data-[collapsible=icon]:overflow-y-auto">
        <NavMain items={navigation} />
      </SidebarContent>
    </Sidebar>
  );
}
