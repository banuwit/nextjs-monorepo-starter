import type { Metadata } from "next";
import { RowTablePage } from "@/features/table/drag-and-drop/row/components/row-table-page";

export const metadata: Metadata = {
  title: "Table · Drag & Drop Row | Workspace",
  description: "A data table where rows can be reordered by drag and drop.",
};

export default function Page() {
  return <RowTablePage />;
}
