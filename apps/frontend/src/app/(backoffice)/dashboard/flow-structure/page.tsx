import type { Metadata } from "next";
import { FlowStructurePage } from "@/features/flow-structure/components/flow-structure-page";

export const metadata: Metadata = {
  title: "Flow Structure | Dashboard",
  description:
    "Build and inspect an agent workflow with an interactive flow canvas.",
};

export default function Page() {
  return <FlowStructurePage />;
}
