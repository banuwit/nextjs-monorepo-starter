"use client";

import { MoonIcon, SunIcon } from "lucide-react";

import { NavUser } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { profile } from "@/mocks/profile.mock";

const user = {
  name: profile.name,
  email: profile.workEmail,
};

export function AppHeader() {
  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-20 border-b flex h-12 shrink-0 items-center gap-2 bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger className="-ml-1" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="ml-auto"
        aria-label="Toggle light and dark mode"
        onClick={toggleTheme}
      >
        <MoonIcon className="dark:hidden" />
        <SunIcon className="hidden dark:block" />
      </Button>
      <NavUser user={user} />
    </header>
  );
}
