import { AppBody } from "@/components/app-body";
import { PageHeading } from "@/components/page-heading";

export function UserPage() {
  return (
    <AppBody>
      <PageHeading
        title="User"
        currentPage="User"
        parents={[{ label: "Dashboard", href: "/dashboard" }]}
      />
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </AppBody>
  );
}
