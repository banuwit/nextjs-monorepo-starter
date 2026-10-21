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

export function AppHeader() {
  const { setPreference } = usePreferences();
  function toggleTheme() {
    setPreference(
      "themeMode",
      document.documentElement.classList.contains("dark") ? "light" : "dark",
    );
  }

  return (
    <header className="sticky top-0 z-20 border-b flex h-12 shrink-0 items-center gap-2 bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger className="-ml-1" />
      <MenuSearch />
      <div className="ml-auto flex items-center gap-2">
        <PreferencesMenu />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Toggle light and dark mode"
          onClick={toggleTheme}
        >
          <MoonIcon className="dark:hidden" />
          <SunIcon className="hidden dark:block" />
        </Button>
        <NavUser user={user} />
      </div>
    </header>
  );
}
