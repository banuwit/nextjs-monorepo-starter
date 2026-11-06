import type { Metadata } from "next";
import { InlineTablePage } from "@/features/table/editable/inline/components/inline-table-page";

export const metadata: Metadata = {
  title: "Table · Editable Inline | Workspace",
  description: "A data table with inline cell editing and Save and Discard.",
};

export default function Page() {
  return <InlineTablePage />;
}
