import type { Metadata } from "next";
import { TimelineWorkflowPage } from "@/features/timeline-workflow/components/timeline-workflow-page";

export const metadata: Metadata = {
  title: "Timeline Workflow | Dashboard",
  description:
    "A horizontal approval workflow timeline with stages, attachments, ratings, and owners.",
};

export default function Page() {
  return <TimelineWorkflowPage />;
}
