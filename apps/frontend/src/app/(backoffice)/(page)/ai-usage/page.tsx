import type { Metadata } from "next";
import { AiUsagePage } from "@/features/ai-usage/components/ai-usage-page";

export const metadata: Metadata = {
  title: "AI Usage | Dashboard",
  description:
    "A spend map that fans monthly AI spend out by model, team, agent and API key.",
};

export default function Page() {
  return <AiUsagePage />;
}
