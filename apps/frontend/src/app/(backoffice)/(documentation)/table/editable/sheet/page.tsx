import type { Metadata } from "next";
import { SheetTablePage } from "@/features/table/editable/sheet/components/sheet-table-page";

export const metadata: Metadata = {
  title: "Table · Editable Sheet | Workspace",
  description:
    "A spreadsheet-style table with range selection, clipboard, and fill.",
};

export default function Page() {
  return <SheetTablePage />;
}
