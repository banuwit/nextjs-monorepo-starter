"use client";

import { useEffect, type ReactNode } from "react";

import { useMultiSidebarSection } from "@/components/app-multi-sidebar";
import { NavMain } from "@/components/nav-main";
import { SidebarContent, useSidebar } from "@/components/ui/sidebar";
import { usePreferences } from "@/providers/preferences-provider";

/**
 * Layer 2 gaya Multi: menu level 1 + sub menu dari group aktif, di bawah header
 * dan di samping konten. Gaya lain merender children apa adanya.
 */
export function AppMultiSidebarPanel({ children }: { children: ReactNode }) {
  const { values } = usePreferences();
  const { open, setOpen } = useSidebar();
  const section = useMultiSidebarSection();
  const isMulti = values.sidebarStyle === "multi";

  // Layer 2 tidak bisa di-collapse. NavMain membaca state sidebar, jadi state
  // collapsed dari gaya lain dikembalikan ke expanded.
  useEffect(() => {
    if (isMulti && !open) setOpen(true);
  }, [isMulti, open, setOpen]);

  if (!isMulti) return <>{children}</>;

  return (
    <div data-slot="app-multi-sidebar-layout" className="flex min-w-0 flex-1">
      <aside
        data-slot="app-multi-sidebar-panel"
        aria-label={section?.title}
        className="sticky top-12 hidden h-[calc(100svh-4rem)] w-(--sidebar-width) shrink-0 flex-col border-r md:flex"
      >
        <SidebarContent>
          {section && <NavMain items={[section]} />}
        </SidebarContent>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
