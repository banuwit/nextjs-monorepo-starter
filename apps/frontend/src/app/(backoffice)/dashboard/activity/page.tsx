import type { Metadata } from "next";
import { ActivityPage } from "@/features/activity/components/activity-page";

export const metadata: Metadata = {
  title: "Activity | Dashboard",
  description:
    "A timeline of product releases, improvements, and platform updates.",
};

export default function Page() {
  return <ActivityPage />;
}
