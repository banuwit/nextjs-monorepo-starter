"use client";

import { AppHeaderMenubar } from "@/components/app-header-menubar";
import { AppHeaderActions } from "@/components/app-sidebar-header";
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
        <header className="flex h-12 items-center gap-1 px-2 sm:gap-2 sm:px-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <Separator
            orientation="vertical"
            className="data-vertical:h-4 md:hidden"
          />
          <TeamSwitcher placement="header" />
          <AppHeaderActions showSearch searchIconOnly={isMobile} />
        </header>
        <AppHeaderMenubar />
      </div>
    </div>
  );
}
