import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import { TeamSwitcherProvider } from "@/components/team-switcher";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function BackofficeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TeamSwitcherProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <AppSidebarHeader />
          <AppHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TeamSwitcherProvider>
  );
}
