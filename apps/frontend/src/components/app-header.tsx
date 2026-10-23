"use client";

import { AppHeaderMenubar } from "@/components/app-header-menubar";
import { AppHeaderActions } from "@/components/app-sidebar-header";
import { MenuSearch } from "@/components/menu-search";
import { TeamSwitcher } from "@/components/team-switcher";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePreferences } from "@/providers/preferences-provider";

export function AppHeader() {
  const { values } = usePreferences();
  const isMobile = useIsMobile();
  if (values.sidebarStyle !== "header") return null;

  return (
    <div
      data-slot="app-header-layout-shell"
      className="sticky top-0 z-20 shrink-0"
    >
      <div data-slot="app-header">
        <header className="flex h-12 items-center gap-2 px-2 border-b">
          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <Separator
              orientation="vertical"
              className="data-vertical:h-12 md:hidden"
            />
            <TeamSwitcher placement="header" />
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <MenuSearch iconOnly={isMobile} />
            <AppHeaderActions />
          </div>
        </header>
        <AppHeaderMenubar />
      </div>
    </div>
  );
}
