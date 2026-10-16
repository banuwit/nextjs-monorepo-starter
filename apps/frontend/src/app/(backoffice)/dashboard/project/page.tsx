import type { Metadata } from "next";
import { ProjectPage } from "@/features/project/components/project-page";

export const metadata: Metadata = { title: "Project | Workspace" };

export default function Page() {
  return <ProjectPage />;
}
