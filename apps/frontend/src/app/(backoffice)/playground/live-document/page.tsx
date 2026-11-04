import type { Metadata } from "next";
import { LiveDocumentPage } from "@/features/live-document/components/live-document-page";

export const metadata: Metadata = {
  title: "Live Document | Playground",
  description:
    "Co-edit a spec with live cursors, presence, an offline switch and synced comment threads.",
};

export default function Page() {
  return <LiveDocumentPage />;
}
