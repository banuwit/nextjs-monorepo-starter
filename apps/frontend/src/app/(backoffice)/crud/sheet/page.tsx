import type { Metadata } from "next";
import { SheetPage } from "@/features/crud/sheet/components/sheet-page";

export const metadata: Metadata = {
  title: "CRUD · Sheet | Workspace",
  description: "CRUD pattern that creates and edits records in a side sheet.",
};

export default function Page() {
  return <SheetPage />;
}
