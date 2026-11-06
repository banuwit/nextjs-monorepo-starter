import type { Metadata } from "next";
import { RowTablePage } from "@/features/table/editable/row/components/row-table-page";

export const metadata: Metadata = {
  title: "Table · Editable Row | Workspace",
  description: "A data table with per-row edit, duplicate, and delete actions.",
};

export default function Page() {
  return <RowTablePage />;
}
