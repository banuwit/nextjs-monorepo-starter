import type { Metadata } from "next";
import { AgentTaskPage } from "@/features/ai-chat/panel/components/agent-task-page";

export const metadata: Metadata = {
  title: "AI Chat · Panel | Workspace",
  description:
    "An AI chat panel that runs agent tasks beside the conversation.",
};

export default function Page() {
  return <AgentTaskPage />;
}
