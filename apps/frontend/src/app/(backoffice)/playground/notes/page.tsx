import type { Metadata } from "next";
import { NotesPage } from "@/features/notes/components/notes-page";

export const metadata: Metadata = {
  title: "Notes | Playground",
  description: "Write and organize notes with a rich text wiki editor.",
};
export default function Page() {
  return <NotesPage />;
}
