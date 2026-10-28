"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GalleryVerticalEndIcon } from "lucide-react";

import {
  type NavigationSection,
  useAppNavigation,
} from "@/components/app-navigation";
import { findActiveNavigationSection } from "@/components/navigation-active";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { profile } from "@/mocks/profile.mock";
import { usePreferences } from "@/providers/preferences-provider";

const user = {
  name: "Banu Rusman",
  email: profile.workEmail,
};

/*
 * Group yang dipilih dari rail. Klik rail hanya mengganti isi layer 2 tanpa
 * berpindah halaman; pilihan berlaku sampai route berubah. Disimpan di luar
 * React agar rail dan panel (layer 2) di bagian layout berbeda tetap sinkron.
 */
let selectedSection: { title: string; pathname: string } | null = null;
const selectedListeners = new Set<() => void>();

function setSelectedSection(value: typeof selectedSection) {
  selectedSection = value;
  selectedListeners.forEach((listener) => listener());
}

function subscribeSelectedSection(listener: () => void) {
  selectedListeners.add(listener);
  return () => {
    selectedListeners.delete(listener);
  };
}

/** Group yang ditampilkan gaya Multi: pilihan rail, lalu group route aktif. */
export function useMultiSidebarSection(): NavigationSection | undefined {
  const navigation = useAppNavigation();
  const pathname = usePathname();
  const selected = useSyncExternalStore(
    subscribeSelectedSection,
    () => selectedSection,
    () => null,
  );
  const activeSection = findActiveNavigationSection(navigation, pathname);
  if (selected?.pathname !== pathname) return activeSection;
  return (
    navigation.find((section) => section.title === selected.title) ??
    activeSection
  );
}

/**
 * Layer 1 gaya Multi: rail ikon group menu di desktop dan drawer sidebar
 * lengkap di mobile. Gaya lain merender `children` (AppSidebar) apa adanya.
 */
export function AppMultiSidebar({ children }: { children: ReactNode }) {
  const { values } = usePreferences();
  const navigation = useAppNavigation();
  const pathname = usePathname();
  const shownSection = useMultiSidebarSection();

  // Halaman baru dibuka dari layer 2: group kembali mengikuti route aktif.
  useEffect(() => {
    setSelectedSection(null);
  }, [pathname]);

  if (values.sidebarStyle !== "multi") return <>{children}</>;

  return (
    <>
      <aside
        data-slot="app-multi-sidebar-rail"
        aria-label="Menu groups"
        className="sticky top-0 hidden h-svh w-(--sidebar-width-icon) shrink-0 flex-col items-center gap-4 bg-sidebar py-4 text-sidebar-foreground md:flex"
      >
        <Link
          href="/dashboard/main"
          aria-label="WIT. Indonesia"
          className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
        >
          <GalleryVerticalEndIcon className="size-4" />
        </Link>
        <nav className="flex flex-col items-center gap-1">
          {navigation.map((section) => {
            const isActive = section.title === shownSection?.title;
            return (
              <Tooltip key={section.title}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={section.title}
                      aria-pressed={isActive}
                      className={cn(
                        "size-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive &&
                          "bg-sidebar-accent text-sidebar-accent-foreground",
                      )}
                      onClick={() =>
                        setSelectedSection({ title: section.title, pathname })
                      }
                    />
                  }
                >
                  {section.icon}
                </TooltipTrigger>
                <TooltipContent side="right">{section.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
        <div className="mt-auto">
          <NavUser user={user} placement="rail" />
        </div>
      </aside>
      {/* Drawer mobile; versi desktop disembunyikan lewat CSS gaya Multi. */}
      <Sidebar variant="sidebar" collapsible="offcanvas">
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navigation} />
        </SidebarContent>
      </Sidebar>
    </>
  );
}
