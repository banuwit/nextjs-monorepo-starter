import type { Metadata } from "next";
import { ProjectPage } from "@/features/project/components/project-page";

export const metadata: Metadata = {
  title: "Project | Dashboard",
  description: "Track projects as cards or a table, with details and status.",
};

export default function Page() {
  return <ProjectPage />;
}
