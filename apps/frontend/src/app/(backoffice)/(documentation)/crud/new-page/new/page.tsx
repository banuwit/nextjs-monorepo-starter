import type { Metadata } from "next";
import { NewPageRecordPage } from "@/features/crud/new-page/components/new-page-record-page";

export const metadata: Metadata = {
  title: "CRUD · New Page · Add | Workspace",
  description: "Create a new record on its own page.",
};

export default function Page() {
  return <NewPageRecordPage mode="create" />;
}
