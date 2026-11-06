import type { Metadata } from "next";
import { ModalPage } from "@/features/crud/modal/components/modal-page";

export const metadata: Metadata = {
  title: "CRUD · Modal | Workspace",
  description: "CRUD pattern that creates and edits records in a modal dialog.",
};

export default function Page() {
  return <ModalPage />;
}
