import type { Metadata } from "next";
import { StructurePage } from "@/features/structure/components/structure-page";

export const metadata: Metadata = {
  title: "Structure | Dashboard",
  description:
    "Explore and edit the organisation chart of managers and their reports on an interactive canvas.",
};

export default function Page() {
  return <StructurePage />;
}
