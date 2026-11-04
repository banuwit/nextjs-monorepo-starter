import type { Metadata } from "next";
import { SidebarFilterPage } from "@/features/filter/sidebar/components/sidebar-filter-page";

export const metadata: Metadata = {
  title: "Filter · Sidebar | Workspace",
  description:
    "A product catalog narrowed by a faceted filter sidebar with department pills, price slider, swatches, and removable chips.",
};

export default function Page() {
  return <SidebarFilterPage />;
}
