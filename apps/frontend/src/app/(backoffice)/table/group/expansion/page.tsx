import type { Metadata } from "next";
import { ExpansionTablePage } from "@/features/table/group/expansion/components/expansion-table-page";

export const metadata: Metadata = {
  title: "Table · Group Expansion | Workspace",
  description:
    "A data table where each row expands to show its direct reports.",
};

export default function Page() {
  return <ExpansionTablePage />;
}
