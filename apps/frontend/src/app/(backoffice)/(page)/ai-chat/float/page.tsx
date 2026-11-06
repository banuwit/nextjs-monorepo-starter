import type { Metadata } from "next";
import { CornerChatPage } from "@/features/ai-chat/float/components/corner-chat-page";

export const metadata: Metadata = {
  title: "AI Chat · Float | Workspace",
  description:
    "A floating AI chat window that stays in the corner of the page.",
};

export default function Page() {
  return <CornerChatPage />;
}
