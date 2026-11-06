import type { Metadata } from "next";
import { NotePage } from "@/features/note/components/note-page";

export const metadata: Metadata = {
  title: "Notes | Playground",
  description: "Write and organize notes with a rich text wiki editor.",
};
export default function Page() {
  return <NotePage />;
}
