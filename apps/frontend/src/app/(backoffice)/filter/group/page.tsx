import type { Metadata } from "next";
import { GroupFilterPage } from "@/features/filter/group/components/group-filter-page";

export const metadata: Metadata = {
  title: "Filter · Group | Workspace",
  description:
    "A data table filtered by a nested AND/OR condition builder, as a popover or inline.",
};

export default function Page() {
  return <GroupFilterPage />;
}
