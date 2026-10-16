import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-sidebar-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function BackofficeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
