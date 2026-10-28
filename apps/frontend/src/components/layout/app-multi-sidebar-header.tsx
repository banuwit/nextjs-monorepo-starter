"use client";

import type { ReactNode } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { MenuSearch } from "@/components/layout/menu-search";
import { NavUser, type NavUserData } from "@/components/layout/nav-user";
import { PreferencesMenu } from "@/components/layout/preferences";
import { TeamSwitcher } from "@/components/layout/team-switcher";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePreferences } from "@/providers/preferences-provider";

/**
 * Header gaya Multi: membentang di atas layer 2 dan konten. Gaya lain
 * merender `children` (AppSidebarHeader) apa adanya.
 */
export function AppMultiSidebarHeader({
  user,
  children,
}: {
  user: NavUserData;
  children: ReactNode;
}) {
  const { values, setPreference } = usePreferences();
  const isMobile = useIsMobile();
  if (values.sidebarStyle !== "multi") return <>{children}</>;

  return (
    <div
      data-slot="app-multi-sidebar-header-shell"
      className="sticky top-0 z-20 shrink-0"
    >
      <header
        data-slot="app-header"
        className="flex h-12 shrink-0 items-center gap-2 border-b px-2"
      >
        {/* Desktop tanpa trigger: layer 2 selalu tampil. Mobile membuka drawer. */}
        <SidebarTrigger className="-ml-1 md:hidden" />
        {/* Logo sudah tampil di rail. */}
        <TeamSwitcher placement="header" showLogo={false} />
        <div className="flex min-w-0 flex-1 justify-center">
          <MenuSearch iconOnly={isMobile} />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <PreferencesMenu />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            onClick={() =>
              setPreference(
                "themeMode",
                document.documentElement.classList.contains("dark")
                  ? "light"
                  : "dark",
              )
            }
          >
            <MoonIcon className="dark:hidden" />
            <SunIcon className="hidden dark:block" />
          </Button>
          {/* Desktop memakai avatar di rail. */}
          {isMobile && <NavUser user={user} />}
        </div>
      </header>
    </div>
  );
}
