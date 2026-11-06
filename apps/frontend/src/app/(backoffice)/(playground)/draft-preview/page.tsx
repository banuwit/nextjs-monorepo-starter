import type { Metadata } from "next";
import { DraftPreviewPage } from "@/features/draft-preview/components/draft-preview-page";

export const metadata: Metadata = {
  title: "Draft Preview | Playground",
  description:
    "Create a draft preview, review the A4 document, and download a PDF.",
};

export default function Page() {
  return <DraftPreviewPage />;
}
