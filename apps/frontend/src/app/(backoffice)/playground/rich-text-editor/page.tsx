import type { Metadata } from "next";
import { RichTextEditorPage } from "@/features/rich-text-editor/components/rich-text-editor-page";

export const metadata: Metadata = {
  title: "Rich Text Editor | Playground",
  description: "A rich text editor with formatting, links, and a toolbar.",
};

export default function Page() {
  return <RichTextEditorPage />;
}
