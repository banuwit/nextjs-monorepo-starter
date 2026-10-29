import type { Metadata } from "next";
import { AdvanceFilterPage } from "@/features/filter/advance/components/advance-filter-page";

export const metadata: Metadata = {
  title: "Filter · Advance | Workspace",
  description:
    "A data table filtered by a chip bar of field, condition, and value rules.",
};

export default function Page() {
  return <AdvanceFilterPage />;
}
