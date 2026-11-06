import type { Metadata } from "next";
import { ScrollTablePage } from "@/features/table/scroll/components/scroll-table-page";

export const metadata: Metadata = {
  title: "Table · Scroll | Workspace",
  description:
    "A virtual-scroll data table that loads more rows as you scroll.",
};

export default function Page() {
  return <ScrollTablePage />;
}
