import type { Metadata } from "next";
import { ConnectedAppsChatPage } from "@/features/ai-chat/page/components/connected-apps-chat-page";

export const metadata: Metadata = {
  title: "AI Chat · Page | Workspace",
  description: "A full-page AI chat connected to your apps.",
};

export default function Page() {
  return <ConnectedAppsChatPage />;
}
