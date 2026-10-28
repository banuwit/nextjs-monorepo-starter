import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { AppMultiSidebar } from "@/components/app-multi-sidebar";
import { AppMultiSidebarHeader } from "@/components/app-multi-sidebar-header";
import { AppMultiSidebarPanel } from "@/components/app-multi-sidebar-panel";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { TeamSwitcherProvider } from "@/components/team-switcher";
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
