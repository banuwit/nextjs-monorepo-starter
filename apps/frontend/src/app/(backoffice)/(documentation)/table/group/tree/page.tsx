import type { Metadata } from "next";
import { TreeTablePage } from "@/features/table/group/tree/components/tree-table-page";

export const metadata: Metadata = {
  title: "Table · Group Tree | Workspace",
  description:
    "A data table that shows the manager and report hierarchy as a tree.",
};

export default function Page() {
  return <TreeTablePage />;
}
