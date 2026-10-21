import type { Metadata } from "next";
import { TimelineActivityPage } from "@/features/timeline-activity/components/timeline-activity-page";

export const metadata: Metadata = {
  title: "Timeline Activity | Dashboard",
  description:
    "A timeline of product releases, improvements, and platform updates.",
};

export default function Page() {
  return <TimelineActivityPage />;
}
