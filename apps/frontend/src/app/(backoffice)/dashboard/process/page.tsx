import type { Metadata } from "next";
import { ProcessPage } from "@/features/process/components/process-page";

export const metadata: Metadata = {
  title: "Process | Dashboard",
  description: "Build and inspect an interactive automation workflow.",
};

export default function Page() {
  return <ProcessPage />;
}
