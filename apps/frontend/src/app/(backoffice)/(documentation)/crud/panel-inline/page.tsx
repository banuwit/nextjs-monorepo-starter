import type { Metadata } from "next";
import { PanelInlinePage } from "@/features/crud/panel-inline/components/panel-inline-page";

export const metadata: Metadata = {
  title: "CRUD · Panel Inline | Workspace",
  description:
    "CRUD pattern that edits records in an inline panel beside the list.",
};

export default function Page() {
  return <PanelInlinePage />;
}
