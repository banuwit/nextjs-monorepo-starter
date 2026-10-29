import type { Metadata } from "next";
import { WorkflowPage } from "@/features/workflow/components/workflow-page";

export const metadata: Metadata = {
  title: "Workflow | Dashboard",
  description:
    "A horizontal approval workflow timeline with stages, attachments, ratings, and owners.",
};

export default function Page() {
  return <WorkflowPage />;
}
