import type { Metadata } from "next";
import { ColumnTablePage } from "@/features/table/drag-and-drop/column/components/column-table-page";

export const metadata: Metadata = {
  title: "Table · Drag & Drop Column | Workspace",
  description: "A data table where columns can be reordered by drag and drop.",
};

export default function Page() {
  return <ColumnTablePage />;
}
