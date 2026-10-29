import type { Metadata } from "next";
import { StructurePage } from "@/features/structure/components/structure-page";

export const metadata: Metadata = {
  title: "Structure | Dashboard",
  description:
    "Build and inspect an agent workflow with an interactive flow canvas.",
};

export default function Page() {
  return <StructurePage />;
}
