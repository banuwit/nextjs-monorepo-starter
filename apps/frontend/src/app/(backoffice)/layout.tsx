import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppMultiSidebar } from "@/components/layout/app-multi-sidebar";
import { AppMultiSidebarHeader } from "@/components/layout/app-multi-sidebar-header";
import { AppMultiSidebarPanel } from "@/components/layout/app-multi-sidebar-panel";
import { AppSidebarHeader } from "@/components/layout/app-sidebar-header";
import { TeamSwitcherProvider } from "@/components/layout/team-switcher";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function BackofficeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TeamSwitcherProvider>
      <SidebarProvider>
        <AppMultiSidebar>
          <AppSidebar />
        </AppMultiSidebar>
        <SidebarInset className="min-w-0">
          <AppMultiSidebarHeader>
            <AppSidebarHeader />
          </AppMultiSidebarHeader>
          <AppHeader />
          <AppMultiSidebarPanel>{children}</AppMultiSidebarPanel>
        </SidebarInset>
      </SidebarProvider>
    </TeamSwitcherProvider>
  );
}
