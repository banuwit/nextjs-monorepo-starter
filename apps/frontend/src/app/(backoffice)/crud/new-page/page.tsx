import type { Metadata } from "next";
import { NewPageListPage } from "@/features/crud/new-page/components/new-page-list-page";

export const metadata: Metadata = {
  title: "CRUD · New Page | Workspace",
  description:
    "CRUD pattern that opens create, detail, and edit on separate pages.",
};

export default function Page() {
  return <NewPageListPage />;
}
