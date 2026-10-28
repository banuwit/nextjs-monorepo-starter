"use client";

import { MoonIcon, SunIcon } from "lucide-react";

import { MenuSearch } from "@/components/menu-search";
import { NavUser } from "@/components/nav-user";
import { PreferencesMenu } from "@/components/preferences";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { profile } from "@/mocks/profile.mock";
import { usePreferences } from "@/providers/preferences-provider";

const user = {
  name: "Banu Rusman",
  email: profile.workEmail,
};

export function AppHeaderActions({
  showSearch = false,
  searchIconOnly = false,
}: {
  showSearch?: boolean;
  searchIconOnly?: boolean;
}) {
  const { setPreference } = usePreferences();

  return (
    <div className="ml-auto flex items-center gap-1 sm:gap-2">
      {showSearch && <MenuSearch iconOnly={searchIconOnly} />}
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
      <NavUser user={user} />
    </div>
  );
}

export function AppSidebarHeader() {
  const { values } = usePreferences();
  if (values.sidebarStyle === "header") return null;

  return (
    <div
      data-slot="app-sidebar-header-shell"
      className="sticky top-0 z-20 shrink-0"
    >
      <header
        data-slot="app-header"
        className="border-b flex h-12 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      >
        <SidebarTrigger className="-ml-1" />
        <MenuSearch />
        <AppHeaderActions />
      </header>
    </div>
  );
}
