import type { Metadata } from "next";
import { SectionTablePage } from "@/features/table/group/section/components/section-table-page";

export const metadata: Metadata = {
  title: "Table · Group Section | Workspace",
  description: "A data table grouped into collapsible sections by role.",
};

export default function Page() {
  return <SectionTablePage />;
}
