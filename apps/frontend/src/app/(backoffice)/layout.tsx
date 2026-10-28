import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AppMultiSidebar } from "@/components/layout/app-multi-sidebar";
import { AppMultiSidebarHeader } from "@/components/layout/app-multi-sidebar-header";
import { AppMultiSidebarPanel } from "@/components/layout/app-multi-sidebar-panel";
import { AppSidebarHeader } from "@/components/layout/app-sidebar-header";
import { TeamSwitcherProvider } from "@/components/layout/team-switcher";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { profile } from "@/mocks/profile.mock";

// Data contoh sampai session Better Auth tersedia.
const user = { name: profile.name, email: profile.workEmail };

export default function BackofficeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TeamSwitcherProvider>
      <SidebarProvider>
        <AppMultiSidebar user={user}>
          <AppSidebar />
        </AppMultiSidebar>
        <SidebarInset className="min-w-0">
          <AppMultiSidebarHeader user={user}>
            <AppSidebarHeader user={user} />
          </AppMultiSidebarHeader>
          <AppHeader user={user} />
          <AppMultiSidebarPanel>{children}</AppMultiSidebarPanel>
        </SidebarInset>
      </SidebarProvider>
    </TeamSwitcherProvider>
  );
}
